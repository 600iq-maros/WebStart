import { z } from "zod"

export const wizardSchema = z.object({
  // Step 1: Business Info
  businessName: z.string().min(1, "Business name is required"),
  industry: z.string().min(1, "Industry is required"),
  businessDescription: z.string().min(10, "Please provide a brief description (at least 10 characters)"),
  targetAudience: z.string().min(1, "Target audience is required"),

  // Step 2: Design Preferences
  colorPalette: z.string().min(1, "Please select a color palette"),
  designStyle: z.string().min(1, "Please select a design style"),
  mood: z.string().min(1, "Please select a mood"),
  logoUrl: z.string().optional().default(""),
  referenceWebsites: z.string().optional().default(""),

  // Step 3: Content & Pages
  pages: z.array(z.string()).min(1, "Select at least one page"),
  heroHeadline: z.string().optional().default(""),
  heroSubheadline: z.string().optional().default(""),
  services: z.string().min(1, "List at least one service"),
  copyTone: z.string().min(1, "Please select a tone"),

  // Step 4: Features
  includeContactForm: z.boolean().default(true),
  includeNewsletter: z.boolean().default(false),
  socialLinks: z.object({
    twitter: z.string().optional().default(""),
    linkedin: z.string().optional().default(""),
    instagram: z.string().optional().default(""),
    facebook: z.string().optional().default(""),
  }).default({ twitter: "", linkedin: "", instagram: "", facebook: "" }),
  specialFeatures: z.array(z.string()).default([]),

  // Step 5: Details
  contactEmail: z.string().email("Please enter a valid email").optional().or(z.literal("")),
  contactPhone: z.string().optional().default(""),
  contactAddress: z.string().optional().default(""),
  language: z.string().min(1, "Please select a language"),
})

export type WizardFormData = z.infer<typeof wizardSchema>

export const defaultWizardValues: WizardFormData = {
  businessName: "",
  industry: "",
  businessDescription: "",
  targetAudience: "",
  colorPalette: "",
  designStyle: "",
  mood: "",
  logoUrl: "",
  referenceWebsites: "",
  pages: ["Home", "About", "Contact"],
  heroHeadline: "",
  heroSubheadline: "",
  services: "",
  copyTone: "",
  includeContactForm: true,
  includeNewsletter: false,
  socialLinks: {
    twitter: "",
    linkedin: "",
    instagram: "",
    facebook: "",
  },
  specialFeatures: [],
  contactEmail: "",
  contactPhone: "",
  contactAddress: "",
  language: "English",
}
