import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { runPipeline } from "@/lib/services/pipeline"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: session.user.id, status: "FAILED" },
  })

  if (!project) {
    return NextResponse.json(
      { error: "Not found or not in FAILED state" },
      { status: 404 }
    )
  }

  await prisma.project.update({
    where: { id: project.id },
    data: { status: "QUEUED", errorMessage: null },
  })

  // Re-trigger the pipeline directly
  runPipeline(project.id).catch(console.error)

  return NextResponse.json({ status: "retrying" })
}
