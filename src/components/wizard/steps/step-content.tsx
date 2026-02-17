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
import { PAGE_OPTIONS, COPY_TONES } from "@/lib/utils/project-config"
import type { WizardFormData } from "@/lib/utils/wizard-schema"

interface StepProps {
  data: WizardFormData
  onChange: (field: string, value: unknown) => void
}

export function StepContent({ data, onChange }: StepProps) {
  const togglePage = (page: string) => {
    const current = data.pages || []
    if (current.includes(page)) {
      onChange(
        "pages",
        current.filter((p) => p !== page)
      )
    } else {
      onChange("pages", [...current, page])
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Pages to Include *</Label>
        <div className="grid grid-cols-2 gap-2">
          {PAGE_OPTIONS.map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => togglePage(page)}
              className={`rounded-md border px-3 py-2 text-sm text-left transition-colors ${
                data.pages?.includes(page)
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-input hover:bg-muted"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="heroHeadline">Hero Headline (optional)</Label>
        <Input
          id="heroHeadline"
          placeholder="Leave blank for AI to generate"
          value={data.heroHeadline}
          onChange={(e) => onChange("heroHeadline", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="heroSubheadline">Hero Subheadline (optional)</Label>
        <Input
          id="heroSubheadline"
          placeholder="Leave blank for AI to generate"
          value={data.heroSubheadline}
          onChange={(e) => onChange("heroSubheadline", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="services">Services / Offerings *</Label>
        <Textarea
          id="services"
          placeholder="List your main services, separated by commas..."
          value={data.services}
          onChange={(e) => onChange("services", e.target.value)}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="copyTone">Tone of Copy *</Label>
        <Select
          value={data.copyTone}
          onValueChange={(value) => onChange("copyTone", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Choose a writing tone" />
          </SelectTrigger>
          <SelectContent>
            {COPY_TONES.map((tone) => (
              <SelectItem key={tone} value={tone}>
                {tone}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
