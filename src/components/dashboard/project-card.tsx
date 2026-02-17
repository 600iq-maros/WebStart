"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "./status-badge"
import { ExternalLink, MessageSquare, RotateCcw, Loader2 } from "lucide-react"
import { GENERATION_STEPS, getStepIndex } from "@/lib/constants/generation-steps"
import type { ProjectStatus } from "@prisma/client"

interface ProjectCardProps {
  project: {
    id: string
    name: string
    status: ProjectStatus
    deploymentUrl: string | null
    createdAt: Date
  }
}

export function ProjectCard({ project: initialProject }: ProjectCardProps) {
  const [project, setProject] = useState(initialProject)
  const [generationStep, setGenerationStep] = useState<string | null>(null)
  const isInProgress = project.status === "QUEUED" || project.status === "GENERATING" || project.status === "DEPLOYING"

  useEffect(() => {
    if (!isInProgress) return

    const interval = setInterval(async () => {
      const res = await fetch(`/api/projects/${project.id}/status`)
      if (res.ok) {
        const data = await res.json()
        setProject((prev) => ({ ...prev, ...data }))
        setGenerationStep(data.generationStep ?? null)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [project.id, isInProgress])

  const handleRetry = async () => {
    const res = await fetch(`/api/generate/${project.id}/retry`, { method: "POST" })
    if (res.ok) {
      setProject((prev) => ({ ...prev, status: "QUEUED" as ProjectStatus }))
    }
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold truncate pr-2">
          {project.name}
        </CardTitle>
        <StatusBadge status={project.status} />
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground">
          Created {new Date(project.createdAt).toLocaleDateString()}
        </p>
        {project.deploymentUrl && (
          <p className="text-sm text-muted-foreground mt-1 truncate">
            {project.deploymentUrl}
          </p>
        )}
        {isInProgress && generationStep && (
          <div className="mt-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin shrink-0" />
              <span className="truncate">
                {GENERATION_STEPS[getStepIndex(generationStep)]?.label ?? "Processing..."}
              </span>
              <span className="ml-auto shrink-0">
                {getStepIndex(generationStep) + 1}/{GENERATION_STEPS.length}
              </span>
            </div>
            <div className="mt-1.5 h-1 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{
                  width: `${((getStepIndex(generationStep) + 1) / GENERATION_STEPS.length) * 100}%`,
                }}
              />
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex gap-2">
        {project.status === "LIVE" && (
          <>
            <a href={project.deploymentUrl!} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm">
                <ExternalLink className="mr-1 h-3 w-3" />
                Visit
              </Button>
            </a>
            <Link href={`/projects/${project.id}/chat`}>
              <Button variant="outline" size="sm">
                <MessageSquare className="mr-1 h-3 w-3" />
                Edit
              </Button>
            </Link>
          </>
        )}
        {project.status === "FAILED" && (
          <Button variant="outline" size="sm" onClick={handleRetry}>
            <RotateCcw className="mr-1 h-3 w-3" />
            Retry
          </Button>
        )}
        <Link href={`/projects/${project.id}`} className="ml-auto">
          <Button variant="ghost" size="sm">Details</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
