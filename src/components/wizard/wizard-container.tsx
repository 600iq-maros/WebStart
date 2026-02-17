"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { WizardStep } from "./wizard-step"
import { StepBusinessInfo } from "./steps/step-business-info"
import { StepDesignPreferences } from "./steps/step-design-preferences"
import { StepContent } from "./steps/step-content"
import { StepFeatures } from "./steps/step-features"
import { StepReview } from "./steps/step-review"
import { defaultWizardValues, type WizardFormData } from "@/lib/utils/wizard-schema"
import { createProject } from "@/app/(dashboard)/projects/new/actions"

const STEPS = [
  { title: "Business Info", description: "Tell us about your business" },
  { title: "Design Preferences", description: "Choose your visual identity" },
  { title: "Content & Pages", description: "Define your website structure" },
  { title: "Features", description: "Select additional functionality" },
  { title: "Review & Launch", description: "Final details and generate your website" },
]

export function WizardContainer() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [data, setData] = useState<WizardFormData>(defaultWizardValues)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = useCallback((field: string, value: unknown) => {
    setData((prev) => ({ ...prev, [field]: value }))
  }, [])

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1))
  }

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const result = await createProject(data)
      if (result?.error) {
        toast.error(result.error)
        setIsSubmitting(false)
        return
      }
      toast.success("Project created! Generation started.")
      router.push(`/projects/${result.projectId}`)
    } catch {
      toast.error("Failed to create project. Please try again.")
      setIsSubmitting(false)
    }
  }

  const stepProps = { data, onChange: handleChange }

  return (
    <div className="max-w-2xl mx-auto">
      <WizardStep
        title={STEPS[currentStep].title}
        description={STEPS[currentStep].description}
        stepNumber={currentStep + 1}
        totalSteps={STEPS.length}
        onNext={handleNext}
        onPrev={handlePrev}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        isLast={currentStep === STEPS.length - 1}
      >
        {currentStep === 0 && <StepBusinessInfo {...stepProps} />}
        {currentStep === 1 && <StepDesignPreferences {...stepProps} />}
        {currentStep === 2 && <StepContent {...stepProps} />}
        {currentStep === 3 && <StepFeatures {...stepProps} />}
        {currentStep === 4 && <StepReview {...stepProps} />}
      </WizardStep>
    </div>
  )
}
