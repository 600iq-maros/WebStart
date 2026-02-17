import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Anthropic from "@anthropic-ai/sdk"
import { chatEditSystemPrompt } from "@/lib/prompts/chat-edit-prompt"
import { fetchRepoFiles, commitChanges } from "@/lib/services/github"

let _anthropic: Anthropic | null = null
function getAnthropic(): Anthropic {
  if (!_anthropic) {
    const apiKey = process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY
    if (!apiKey) throw new Error("CLAUDE_API_KEY or ANTHROPIC_API_KEY not set")
    _anthropic = new Anthropic({ apiKey })
  }
  return _anthropic
}

export const maxDuration = 120

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { message } = await req.json()

  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: session.user.id },
  })

  if (!project || !project.githubRepo) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 })
  }

  // 1. Save user message
  await prisma.chatMessage.create({
    data: { role: "user", content: message, projectId: project.id },
  })

  try {
    // 2. Fetch current code from GitHub
    const currentFiles = await fetchRepoFiles(project.githubRepo)

    // 3. Build context with relevant files
    const relevantFiles = selectRelevantFiles(currentFiles)
    const fileContext = Object.entries(relevantFiles)
      .map(([path, content]) => `--- ${path} ---\n${content}`)
      .join("\n\n")

    // 4. Ask Claude for changes
    const response = await getAnthropic().messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 8000,
      system: chatEditSystemPrompt,
      messages: [
        {
          role: "user",
          content: `Current codebase files:\n\n${fileContext}\n\nUser request: ${message}\n\nReturn ONLY valid JSON with this structure: { "filesToUpdate": { "path": "full new content" }, "filesToCreate": { "path": "content" }, "filesToDelete": ["path"], "explanation": "what was changed" }`,
        },
      ],
    })

    const textBlock = response.content.find((block) => block.type === "text")
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("No text response from AI")
    }

    const text = textBlock.text
    const cleaned = text
      .replace(/^```(?:json)?\s*\n?/m, "")
      .replace(/\n?```\s*$/m, "")
      .trim()

    const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("Failed to parse edit response")
    }

    const changes = JSON.parse(jsonMatch[0]) as {
      filesToUpdate?: Record<string, string>
      filesToCreate?: Record<string, string>
      filesToDelete?: string[]
      explanation: string
    }

    // 5. Commit changes to GitHub (triggers auto-deploy on Vercel)
    const allUpdates = {
      ...(changes.filesToUpdate || {}),
      ...(changes.filesToCreate || {}),
    }

    if (Object.keys(allUpdates).length > 0 || (changes.filesToDelete?.length ?? 0) > 0) {
      await commitChanges({
        repoFullName: project.githubRepo,
        filesToUpdate: allUpdates,
        filesToDelete: changes.filesToDelete || [],
        commitMessage: `Update: ${message.substring(0, 72)}`,
      })
    }

    // 6. Save assistant response
    await prisma.chatMessage.create({
      data: {
        role: "assistant",
        content: changes.explanation,
        metadata: {
          filesUpdated: Object.keys(changes.filesToUpdate || {}),
          filesCreated: Object.keys(changes.filesToCreate || {}),
          filesDeleted: changes.filesToDelete || [],
        },
        projectId: project.id,
      },
    })

    return NextResponse.json({
      explanation: changes.explanation,
      filesChanged: [
        ...Object.keys(changes.filesToUpdate || {}),
        ...Object.keys(changes.filesToCreate || {}),
      ],
    })
  } catch (error) {
    console.error("[Chat] Error:", error)

    const errorMessage =
      error instanceof Error ? error.message : "Failed to process changes"

    // Save error as assistant message
    await prisma.chatMessage.create({
      data: {
        role: "assistant",
        content: `Sorry, I encountered an error: ${errorMessage}. Please try again.`,
        projectId: project.id,
      },
    })

    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

function selectRelevantFiles(
  files: Record<string, string>
): Record<string, string> {
  const relevant: Record<string, string> = {}

  for (const [path, content] of Object.entries(files)) {
    // Include all source code files (skip node_modules, lock files, etc.)
    if (
      (path.endsWith(".tsx") ||
        path.endsWith(".ts") ||
        path.endsWith(".css") ||
        path.endsWith(".mjs")) &&
      !path.includes("node_modules")
    ) {
      relevant[path] = content
    }
  }

  return relevant
}
