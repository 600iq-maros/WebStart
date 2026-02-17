"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SPECIAL_FEATURES } from "@/lib/utils/project-config"
import type { WizardFormData } from "@/lib/utils/wizard-schema"

interface StepProps {
  data: WizardFormData
  onChange: (field: string, value: unknown) => void
}

export function StepFeatures({ data, onChange }: StepProps) {
  const toggleFeature = (feature: string) => {
    const current = data.specialFeatures || []
    if (current.includes(feature)) {
      onChange(
        "specialFeatures",
        current.filter((f) => f !== feature)
      )
    } else {
      onChange("specialFeatures", [...current, feature])
    }
  }

  const updateSocial = (platform: string, value: string) => {
    onChange("socialLinks", {
      ...data.socialLinks,
      [platform]: value,
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={data.includeContactForm}
            onChange={(e) => onChange("includeContactForm", e.target.checked)}
            className="h-4 w-4 rounded border-input"
          />
          <span className="text-sm">Include contact form</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={data.includeNewsletter}
            onChange={(e) => onChange("includeNewsletter", e.target.checked)}
            className="h-4 w-4 rounded border-input"
          />
          <span className="text-sm">Include newsletter signup</span>
        </label>
      </div>

      <div className="space-y-2">
        <Label>Social Media Links (optional)</Label>
        <div className="grid grid-cols-2 gap-3">
          <Input
            placeholder="Twitter / X URL"
            value={data.socialLinks?.twitter ?? ""}
            onChange={(e) => updateSocial("twitter", e.target.value)}
          />
          <Input
            placeholder="LinkedIn URL"
            value={data.socialLinks?.linkedin ?? ""}
            onChange={(e) => updateSocial("linkedin", e.target.value)}
          />
          <Input
            placeholder="Instagram URL"
            value={data.socialLinks?.instagram ?? ""}
            onChange={(e) => updateSocial("instagram", e.target.value)}
          />
          <Input
            placeholder="Facebook URL"
            value={data.socialLinks?.facebook ?? ""}
            onChange={(e) => updateSocial("facebook", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Special Features</Label>
        <div className="grid grid-cols-2 gap-2">
          {SPECIAL_FEATURES.map((feature) => (
            <button
              key={feature}
              type="button"
              onClick={() => toggleFeature(feature)}
              className={`rounded-md border px-3 py-2 text-sm text-left transition-colors ${
                data.specialFeatures?.includes(feature)
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-input hover:bg-muted"
              }`}
            >
              {feature}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
