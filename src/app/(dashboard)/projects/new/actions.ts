"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { wizardSchema } from "@/lib/utils/wizard-schema"
import { runPipeline } from "@/lib/services/pipeline"
import type { Prisma } from "@prisma/client"

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 60)
}

export async function createProject(config: unknown) {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "Unauthorized" }
  }

  const parsed = wizardSchema.safeParse(config)
  if (!parsed.success) {
    return { error: parsed.error.issues?.[0]?.message ?? "Invalid form data" }
  }

  const baseSlug = slugify(parsed.data.businessName)
  const slug = `${baseSlug}-${Date.now().toString(36)}`

  const project = await prisma.project.create({
    data: {
      name: parsed.data.businessName,
      slug,
      status: "QUEUED",
      config: parsed.data as unknown as Prisma.InputJsonValue,
      userId: session.user.id,
    },
  })

  // Trigger background generation (fire-and-forget)
  // Call pipeline directly instead of HTTP self-fetch (more reliable locally)
  runPipeline(project.id).catch(console.error)

  return { projectId: project.id }
}
