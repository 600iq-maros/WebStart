import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect, notFound } from "next/navigation"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { ArrowLeft, ExternalLink, Github, MessageSquare } from "lucide-react"
import { GenerationProgressClient } from "@/components/dashboard/generation-progress-client"

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const project = await prisma.project.findFirst({
    where: { id, userId: session.user.id },
  })

  if (!project) notFound()

  const config = project.config as Record<string, unknown>

  return (
    <div className="max-w-3xl mx-auto">
      <Link
        href="/dashboard"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back to Dashboard
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <p className="text-muted-foreground mt-1">
            Created {project.createdAt.toLocaleDateString()}
          </p>
        </div>
        <StatusBadge status={project.status} />
      </div>

      <div className="flex gap-3 mb-8">
        {project.status === "LIVE" && project.deploymentUrl && (
          <>
            <a href={project.deploymentUrl} target="_blank" rel="noopener noreferrer">
              <Button>
                <ExternalLink className="mr-2 h-4 w-4" />
                Visit Site
              </Button>
            </a>
            <Link href={`/projects/${project.id}/chat`}>
              <Button variant="outline">
                <MessageSquare className="mr-2 h-4 w-4" />
                Edit with Chat
              </Button>
            </Link>
          </>
        )}
        {project.githubRepo && (
          <a
            href={`https://github.com/${project.githubRepo}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline">
              <Github className="mr-2 h-4 w-4" />
              View Repo
            </Button>
          </a>
        )}
      </div>

      {(project.status === "QUEUED" || project.status === "GENERATING" || project.status === "DEPLOYING") && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <GenerationProgressClient
              projectId={project.id}
              initialStep={project.generationStep}
              initialStartedAt={project.generationStartedAt?.toISOString() ?? null}
              initialStatus={project.status}
            />
          </CardContent>
        </Card>
      )}

      {project.errorMessage && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-700 text-base">Error Details</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-red-600 font-mono">{project.errorMessage}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Project Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(config).map(([key, value]) => (
            <div key={key}>
              <dt className="text-sm font-medium text-muted-foreground capitalize">
                {key.replace(/([A-Z])/g, " $1").trim()}
              </dt>
              <dd className="text-sm mt-0.5">
                {Array.isArray(value)
                  ? value.join(", ")
                  : typeof value === "object" && value !== null
                    ? JSON.stringify(value, null, 2)
                    : String(value)}
              </dd>
              <Separator className="mt-3" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
