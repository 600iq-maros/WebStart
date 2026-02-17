"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { INDUSTRIES } from "@/lib/utils/project-config"
import type { WizardFormData } from "@/lib/utils/wizard-schema"

interface StepProps {
  data: WizardFormData
  onChange: (field: string, value: unknown) => void
}

export function StepBusinessInfo({ data, onChange }: StepProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="businessName">Business / Project Name *</Label>
        <Input
          id="businessName"
          placeholder="e.g. Acme Solutions"
          value={data.businessName}
          onChange={(e) => onChange("businessName", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="industry">Industry / Niche *</Label>
        <Select
          value={data.industry}
          onValueChange={(value) => onChange("industry", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select an industry" />
          </SelectTrigger>
          <SelectContent>
            {INDUSTRIES.map((industry) => (
              <SelectItem key={industry} value={industry}>
                {industry}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="businessDescription">
          Business Description *
        </Label>
        <Textarea
          id="businessDescription"
          placeholder="Describe what your business does in 2-3 sentences..."
          value={data.businessDescription}
          onChange={(e) => onChange("businessDescription", e.target.value)}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="targetAudience">Target Audience *</Label>
        <Input
          id="targetAudience"
          placeholder="e.g. Small business owners, 25-45 years old"
          value={data.targetAudience}
          onChange={(e) => onChange("targetAudience", e.target.value)}
        />
      </div>
    </div>
  )
}
