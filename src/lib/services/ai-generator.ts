import Anthropic from "@anthropic-ai/sdk"
import { architectureSystemPrompt } from "@/lib/prompts/architecture-prompt"
import { codegenSystemPrompt } from "@/lib/prompts/codegen-prompt"

let _anthropic: Anthropic | null = null
function getAnthropic(): Anthropic {
  if (!_anthropic) {
    // Use CLAUDE_API_KEY as primary since ANTHROPIC_API_KEY gets overridden
    // by the Claude Code CLI environment with an empty/invalid value
    const apiKey = process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY
    console.log(`[AI] Initializing Anthropic client, key present: ${!!apiKey}`)
    if (!apiKey) {
      throw new Error("CLAUDE_API_KEY or ANTHROPIC_API_KEY environment variable is not set")
    }
    _anthropic = new Anthropic({ apiKey })
  }
  return _anthropic
}

export interface GeneratedCodebase {
  files: Record<string, string>
  packageJson: Record<string, unknown>
  summary: string
}

export async function generateArchitecture(config: Record<string, unknown>): Promise<string> {
  const response = await getAnthropic().messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: architectureSystemPrompt,
    messages: [
      {
        role: "user",
        content: `Generate a website architecture plan based on this configuration:\n\n${JSON.stringify(config, null, 2)}`,
      },
    ],
  })

  const textBlock = response.content.find((block) => block.type === "text")
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from architecture generation")
  }
  return textBlock.text
}

export async function generateCode(
  architecture: string,
  config: Record<string, unknown>
): Promise<GeneratedCodebase> {
  // Use streaming for large responses to avoid the 10-minute timeout
  const stream = getAnthropic().messages.stream({
    model: "claude-sonnet-4-20250514",
    max_tokens: 64000,
    system: codegenSystemPrompt,
    messages: [
      {
        role: "user",
        content: `Architecture Plan:\n${architecture}\n\nOriginal Configuration:\n${JSON.stringify(config, null, 2)}\n\nGenerate the complete codebase. Return ONLY valid JSON with the structure: { "files": { "path": "content", ... }, "packageJson": { ... }, "summary": "..." }`,
      },
    ],
  })

  const response = await stream.finalMessage()

  const textBlock = response.content.find((block) => block.type === "text")
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from code generation")
  }

  const text = textBlock.text

  // Extract JSON from response — handle potential markdown code fences
  const cleaned = text
    .replace(/^```(?:json)?\s*\n?/m, "")
    .replace(/\n?```\s*$/m, "")
    .trim()

  const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error("Failed to parse generated code from AI response")
  }

  const parsed = JSON.parse(jsonMatch[0]) as GeneratedCodebase

  if (!parsed.files || typeof parsed.files !== "object") {
    throw new Error("Generated code missing 'files' object")
  }
  if (!parsed.packageJson || typeof parsed.packageJson !== "object") {
    throw new Error("Generated code missing 'packageJson' object")
  }

  return parsed
}
