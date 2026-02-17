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
import { COLOR_PALETTES, DESIGN_STYLES, MOODS } from "@/lib/utils/project-config"
import type { WizardFormData } from "@/lib/utils/wizard-schema"

interface StepProps {
  data: WizardFormData
  onChange: (field: string, value: unknown) => void
}

export function StepDesignPreferences({ data, onChange }: StepProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="colorPalette">Color Palette *</Label>
        <Select
          value={data.colorPalette}
          onValueChange={(value) => onChange("colorPalette", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Choose a color palette" />
          </SelectTrigger>
          <SelectContent>
            {COLOR_PALETTES.map((palette) => (
              <SelectItem key={palette} value={palette}>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {palette
                      .split(" - ")[1]
                      ?.split(", ")
                      .map((color) => (
                        <div
                          key={color}
                          className="h-4 w-4 rounded-full border"
                          style={{ backgroundColor: color.trim() }}
                        />
                      ))}
                  </div>
                  <span>{palette.split(" - ")[0]}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="designStyle">Design Style *</Label>
        <Select
          value={data.designStyle}
          onValueChange={(value) => onChange("designStyle", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Choose a design style" />
          </SelectTrigger>
          <SelectContent>
            {DESIGN_STYLES.map((style) => (
              <SelectItem key={style} value={style}>
                {style}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="mood">Overall Mood *</Label>
        <Select
          value={data.mood}
          onValueChange={(value) => onChange("mood", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Choose a mood" />
          </SelectTrigger>
          <SelectContent>
            {MOODS.map((mood) => (
              <SelectItem key={mood} value={mood}>
                {mood}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="logoUrl">Logo URL (optional)</Label>
        <Input
          id="logoUrl"
          placeholder="https://example.com/logo.png"
          value={data.logoUrl}
          onChange={(e) => onChange("logoUrl", e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          Paste a direct URL to your logo image, or leave blank
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="referenceWebsites">Reference Websites (optional)</Label>
        <Input
          id="referenceWebsites"
          placeholder="e.g. stripe.com, linear.app"
          value={data.referenceWebsites}
          onChange={(e) => onChange("referenceWebsites", e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          Comma-separated list of websites you like the design of
        </p>
      </div>
    </div>
  )
}
