import { prisma } from "@/lib/prisma"
import { generateArchitecture, generateCode } from "@/lib/services/ai-generator"
import { createRepoAndPush } from "@/lib/services/github"
import { createVercelProject, triggerDeployment } from "@/lib/services/vercel-deploy"
import { sendProjectReadyEmail, sendProjectFailedEmail } from "@/lib/services/email"

export async function runPipeline(projectId: string) {
  try {
    const project = await prisma.project.findUniqueOrThrow({
      where: { id: projectId },
      include: { user: true },
    })

    const config = project.config as Record<string, unknown>

    // Check if we can skip steps (retry scenario)
    const hasGitHub = !!project.githubRepo
    const hasVercel = !!project.vercelProjectId

    // If we already have both GitHub and Vercel, just re-deploy
    if (hasGitHub && hasVercel) {
      console.log(`[Pipeline] Retrying deployment only for ${project.name}...`)
      await prisma.project.update({
        where: { id: projectId },
        data: {
          status: "DEPLOYING",
          generationStep: "vercel_deploy",
          generationStartedAt: new Date(),
          errorMessage: null,
        },
      })

      const deploymentUrl = await triggerDeployment({
        projectId: project.vercelProjectId!,
        repoFullName: project.githubRepo!,
      })

      await prisma.project.update({
        where: { id: projectId },
        data: {
          status: "LIVE",
          deploymentUrl,
          generationStep: null,
          generationStartedAt: null,
        },
      })

      console.log(`[Pipeline] ${project.name} is LIVE at ${deploymentUrl}`)

      if (project.user.email) {
        await sendProjectReadyEmail({
          to: project.user.email,
          projectName: project.name,
          deploymentUrl,
        }).catch((err: unknown) => console.error("[Pipeline] Email failed:", err))
      }
      return
    }

    // 1. Update status to GENERATING
    await prisma.project.update({
      where: { id: projectId },
      data: {
        status: "GENERATING",
        generationStep: "architecture",
        generationStartedAt: new Date(),
        errorMessage: null,
      },
    })

    // 2. Stage 1: Generate architecture plan
    console.log(`[Pipeline] Generating architecture for ${project.name}...`)
    const architecture = await generateArchitecture(config)

    // Update step: architecture done, starting codegen
    await prisma.project.update({
      where: { id: projectId },
      data: { generationStep: "codegen" },
    })

    // 3. Stage 2: Generate code files
    console.log(`[Pipeline] Generating code for ${project.name}...`)
    const codebase = await generateCode(architecture, config)

    // Update step: codegen done, starting github push
    await prisma.project.update({
      where: { id: projectId },
      data: { generationStep: "github" },
    })

    // 4. Create GitHub repo and push all files
    let repoFullName: string
    if (hasGitHub) {
      // Repo already exists from a previous attempt
      console.log(`[Pipeline] GitHub repo already exists: ${project.githubRepo}`)
      repoFullName = project.githubRepo!
    } else {
      console.log(`[Pipeline] Creating GitHub repo for ${project.name}...`)
      repoFullName = await createRepoAndPush({
        name: project.slug,
        files: codebase.files,
        packageJson: codebase.packageJson,
      })
    }

    // 5. Update status to DEPLOYING
    await prisma.project.update({
      where: { id: projectId },
      data: {
        status: "DEPLOYING",
        githubRepo: repoFullName,
        generationStep: "vercel_create",
      },
    })

    // 6. Create Vercel project linked to GitHub repo and trigger deployment
    console.log(`[Pipeline] Creating Vercel project for ${project.name}...`)
    const { projectId: vercelId, deploymentUrl } = await createVercelProject({
      name: project.slug,
      repoFullName,
      onDeploymentPolling: async () => {
        await prisma.project.update({
          where: { id: projectId },
          data: { generationStep: "vercel_deploy" },
        })
      },
    })

    // 7. Update status to LIVE
    await prisma.project.update({
      where: { id: projectId },
      data: {
        status: "LIVE",
        vercelProjectId: vercelId,
        deploymentUrl,
        generationStep: null,
        generationStartedAt: null,
        generatedCode: {
          summary: codebase.summary,
          fileList: Object.keys(codebase.files),
        },
      },
    })

    console.log(`[Pipeline] ${project.name} is LIVE at ${deploymentUrl}`)

    // 8. Send email notification
    if (project.user.email) {
      await sendProjectReadyEmail({
        to: project.user.email,
        projectName: project.name,
        deploymentUrl,
      }).catch((err: unknown) => console.error("[Pipeline] Email failed:", err))
    }
  } catch (error) {
    console.error(`[Pipeline] Failed for project ${projectId}:`, error)

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred"

    await prisma.project.update({
      where: { id: projectId },
      data: {
        status: "FAILED",
        errorMessage,
        generationStep: null,
        generationStartedAt: null,
      },
    })

    // Try to send failure notification
    try {
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: { user: true },
      })
      if (project?.user.email) {
        await sendProjectFailedEmail({
          to: project.user.email,
          projectName: project.name,
          errorMessage,
        })
      }
    } catch {
      // Ignore email failures
    }
  }
}
