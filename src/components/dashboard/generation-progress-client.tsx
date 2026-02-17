"use client"

import { useEffect, useState } from "react"
import { GenerationProgress } from "./generation-progress"

interface GenerationProgressClientProps {
  projectId: string
  initialStep: string | null
  initialStartedAt: string | null
  initialStatus: string
}

export function GenerationProgressClient({
  projectId,
  initialStep,
  initialStartedAt,
  initialStatus,
}: GenerationProgressClientProps) {
  const [step, setStep] = useState(initialStep)
  const [startedAt, setStartedAt] = useState(initialStartedAt)
  const [status, setStatus] = useState(initialStatus)

  const isInProgress =
    status === "QUEUED" || status === "GENERATING" || status === "DEPLOYING"

  useEffect(() => {
    if (!isInProgress) return

    const interval = setInterval(async () => {
      const res = await fetch(`/api/projects/${projectId}/status`)
      if (res.ok) {
        const data = await res.json()
        setStep(data.generationStep)
        setStartedAt(data.generationStartedAt)
        setStatus(data.status)
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [projectId, isInProgress])

  return (
    <GenerationProgress
      currentStep={step}
      startedAt={startedAt}
      status={status}
    />
  )
}
