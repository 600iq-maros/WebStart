import { NextRequest, NextResponse } from "next/server"
import { runPipeline } from "@/lib/services/pipeline"

export const maxDuration = 300 // 5 minutes (Vercel Pro)

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params

  // Verify internal secret
  const secret = req.headers.get("x-internal-secret")
  if (secret !== process.env.INTERNAL_API_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Run pipeline without awaiting (fire-and-forget in serverless)
  // On Vercel, use waitUntil if available; locally the promise runs in the Node process
  const pipelinePromise = runPipeline(projectId)

  try {
    // Try to use waitUntil for Vercel
    const { waitUntil } = await import("@vercel/functions")
    waitUntil(pipelinePromise)
  } catch {
    // Not on Vercel — just let the promise run
    pipelinePromise.catch(console.error)
  }

  return NextResponse.json({ status: "started" }, { status: 202 })
}
