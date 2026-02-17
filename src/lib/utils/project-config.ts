export interface WizardConfig {
  // Step 1: Business Info
  businessName: string
  industry: string
  businessDescription: string
  targetAudience: string

  // Step 2: Design Preferences
  colorPalette: string
  designStyle: string
  mood: string
  logoUrl: string
  referenceWebsites: string

  // Step 3: Content & Pages
  pages: string[]
  heroHeadline: string
  heroSubheadline: string
  services: string
  copyTone: string

  // Step 4: Features
  includeContactForm: boolean
  includeNewsletter: boolean
  socialLinks: {
    twitter: string
    linkedin: string
    instagram: string
    facebook: string
  }
  specialFeatures: string[]

  // Step 5: Details
  contactEmail: string
  contactPhone: string
  contactAddress: string
  language: string
}

export const COLOR_PALETTES = [
  "Ocean Blue - #0077B6, #00B4D8, #90E0EF",
  "Sunset Orange - #FF6B35, #F7931E, #FFD166",
  "Forest Green - #2D6A4F, #40916C, #74C69D",
  "Royal Purple - #7209B7, #9B5DE5, #C77DFF",
  "Dark Luxury - #1A1A2E, #16213E, #E94560",
  "Coral Reef - #FF6F61, #FF9A8B, #FECDA6",
  "Midnight Tech - #0F0F1A, #1E1E3A, #00D4FF",
  "Warm Earth - #8B5E3C, #C09572, #E8D5B7",
  "Electric Neon - #39FF14, #00FFFF, #FF00FF",
  "Pastel Dream - #FFB5E8, #B5DEFF, #D5AAFF",
  "Slate Modern - #2B2D42, #8D99AE, #EDF2F4",
  "Ruby Red - #9B1B30, #D64045, #E88D67",
  "Golden Hour - #FFD700, #FFA500, #FF6347",
  "Ice Blue - #A8DADC, #457B9D, #1D3557",
  "Sage Green - #B7C4CF, #87A87B, #5F7A61",
  "Monochrome - #000000, #333333, #666666",
  "Terracotta - #C2703B, #E07A5F, #F2CC8F",
  "Berry Mix - #7C3AED, #EC4899, #F97316",
  "Arctic Frost - #E0F7FA, #80DEEA, #00ACC1",
  "Autumn Harvest - #D4A574, #A0522D, #8B4513",
]

export const INDUSTRIES = [
  "Technology / SaaS",
  "Restaurant / Food",
  "Portfolio / Creative",
  "E-commerce / Retail",
  "Agency / Consulting",
  "Blog / Media",
  "Healthcare / Medical",
  "Real Estate",
  "Law / Legal",
  "Plumbing / HVAC",
  "Construction",
  "Fitness / Gym",
  "Education",
  "Non-profit",
  "Photography",
  "Other",
]

export const DESIGN_STYLES = [
  "Modern & Minimal",
  "Bold & Vibrant",
  "Classic & Professional",
  "Playful & Creative",
  "Dark & Edgy",
  "Clean & Corporate",
]

export const MOODS = [
  "Trustworthy & Reliable",
  "Energetic & Dynamic",
  "Calm & Serene",
  "Luxurious & Premium",
  "Friendly & Approachable",
  "Innovative & Cutting-edge",
]

export const PAGE_OPTIONS = [
  "Home",
  "About",
  "Services",
  "Contact",
  "Blog",
  "Portfolio / Gallery",
  "Pricing",
  "FAQ",
  "Testimonials",
  "Team",
]

export const COPY_TONES = [
  "Professional",
  "Casual & Friendly",
  "Witty & Humorous",
  "Inspirational",
  "Direct & Urgent",
  "Warm & Personal",
]

export const SPECIAL_FEATURES = [
  "Dark mode toggle",
  "Scroll animations",
  "Image gallery / lightbox",
  "Testimonials carousel",
  "Pricing table",
  "FAQ accordion",
  "Stats / counter section",
  "Video embed",
]

export const LANGUAGES = [
  "English",
  "Slovak",
  "Czech",
  "German",
  "French",
  "Spanish",
]
