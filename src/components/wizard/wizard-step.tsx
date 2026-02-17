import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Rocket } from "lucide-react"

interface WizardStepProps {
  title: string
  description: string
  stepNumber: number
  totalSteps: number
  children: React.ReactNode
  onNext?: () => void
  onPrev?: () => void
  onSubmit?: () => void
  isSubmitting?: boolean
  isLast?: boolean
}

export function WizardStep({
  title,
  description,
  stepNumber,
  totalSteps,
  children,
  onNext,
  onPrev,
  onSubmit,
  isSubmitting,
  isLast,
}: WizardStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground mb-1">
          Step {stepNumber} of {totalSteps}
        </p>
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-muted-foreground mt-1">{description}</p>
      </div>

      <div className="w-full bg-muted rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${(stepNumber / totalSteps) * 100}%` }}
        />
      </div>

      <div className="space-y-4">{children}</div>

      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={onPrev}
          disabled={stepNumber === 1}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        {isLast ? (
          <Button onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              "Creating..."
            ) : (
              <>
                <Rocket className="mr-2 h-4 w-4" />
                Generate Website
              </>
            )}
          </Button>
        ) : (
          <Button onClick={onNext}>
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
