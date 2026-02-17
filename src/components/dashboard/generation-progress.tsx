"use client"

import { useEffect, useState } from "react"
import { GENERATION_STEPS, getStepIndex } from "@/lib/constants/generation-steps"
import { Check, Loader2, PenTool, Code, Github, Cloud, Rocket } from "lucide-react"
import { cn } from "@/lib/utils"

const stepIcons = [PenTool, Code, Github, Cloud, Rocket]

interface GenerationProgressProps {
  currentStep: string | null
  startedAt: string | null
  status: string
}

export function GenerationProgress({
  currentStep,
  startedAt,
  status,
}: GenerationProgressProps) {
  const [elapsed, setElapsed] = useState("")

  useEffect(() => {
    if (!startedAt) return
    const start = new Date(startedAt).getTime()

    const tick = () => {
      const diff = Math.floor((Date.now() - start) / 1000)
      const mins = Math.floor(diff / 60)
      const secs = diff % 60
      setElapsed(
        mins > 0
          ? `${mins}m ${secs.toString().padStart(2, "0")}s`
          : `${secs}s`
      )
    }

    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [startedAt])

  const activeIndex = getStepIndex(currentStep)
  const isActive = status === "GENERATING" || status === "DEPLOYING"

  if (!isActive && status !== "LIVE") return null

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium">Generation Progress</h3>
        {isActive && elapsed && (
          <span className="text-xs text-muted-foreground font-mono">
            {elapsed} elapsed
          </span>
        )}
      </div>

      <div className="space-y-0">
        {GENERATION_STEPS.map((step, index) => {
          const Icon = stepIcons[index]
          const isCompleted = index < activeIndex || status === "LIVE"
          const isCurrent = index === activeIndex && isActive

          return (
            <div key={step.key} className="flex gap-3 relative">
              {index < GENERATION_STEPS.length - 1 && (
                <div
                  className={cn(
                    "absolute left-[15px] top-[30px] w-0.5 h-[calc(100%-6px)]",
                    isCompleted ? "bg-primary" : "bg-border"
                  )}
                />
              )}

              <div
                className={cn(
                  "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2",
                  isCompleted && "bg-primary border-primary text-primary-foreground",
                  isCurrent && "border-primary bg-background",
                  !isCompleted && !isCurrent && "border-border bg-background text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : isCurrent ? (
                  <Loader2 className="h-4 w-4 text-primary animate-spin" />
                ) : (
                  <Icon className="h-4 w-4" />
                )}
              </div>

              <div className="pb-6 pt-1">
                <p
                  className={cn(
                    "text-sm font-medium leading-none",
                    isCompleted && "text-foreground",
                    isCurrent && "text-foreground",
                    !isCompleted && !isCurrent && "text-muted-foreground"
                  )}
                >
                  {step.label}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {step.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
