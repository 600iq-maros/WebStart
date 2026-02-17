"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LANGUAGES } from "@/lib/utils/project-config"
import type { WizardFormData } from "@/lib/utils/wizard-schema"

interface StepProps {
  data: WizardFormData
  onChange: (field: string, value: unknown) => void
}

export function StepReview({ data, onChange }: StepProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="contactEmail">Contact Email</Label>
          <Input
            id="contactEmail"
            type="email"
            placeholder="hello@example.com"
            value={data.contactEmail}
            onChange={(e) => onChange("contactEmail", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactPhone">Contact Phone</Label>
          <Input
            id="contactPhone"
            placeholder="+1 (555) 123-4567"
            value={data.contactPhone}
            onChange={(e) => onChange("contactPhone", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="contactAddress">Business Address</Label>
        <Input
          id="contactAddress"
          placeholder="123 Main St, City, State"
          value={data.contactAddress}
          onChange={(e) => onChange("contactAddress", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="language">Website Language *</Label>
        <Select
          value={data.language}
          onValueChange={(value) => onChange("language", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGES.map((lang) => (
              <SelectItem key={lang} value={lang}>
                {lang}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Review Your Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <SummaryRow label="Business" value={data.businessName} />
          <SummaryRow label="Industry" value={data.industry} />
          <SummaryRow label="Description" value={data.businessDescription} />
          <SummaryRow label="Target Audience" value={data.targetAudience} />
          <SummaryRow label="Colors" value={data.colorPalette?.split(" - ")[0]} />
          <SummaryRow label="Style" value={data.designStyle} />
          <SummaryRow label="Mood" value={data.mood} />
          <SummaryRow label="Pages" value={data.pages?.join(", ")} />
          <SummaryRow label="Services" value={data.services} />
          <SummaryRow label="Tone" value={data.copyTone} />
          <SummaryRow label="Features" value={data.specialFeatures?.join(", ") || "None"} />
          <SummaryRow label="Language" value={data.language} />
        </CardContent>
      </Card>
    </div>
  )
}

function SummaryRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground shrink-0">{label}</span>
      <span className="text-right truncate">{value || "—"}</span>
    </div>
  )
}
