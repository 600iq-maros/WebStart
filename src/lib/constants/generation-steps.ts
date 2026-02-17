export const GENERATION_STEPS = [
  {
    key: "architecture",
    label: "Designing Architecture",
    description: "AI is planning your website structure",
  },
  {
    key: "codegen",
    label: "Generating Code",
    description: "AI is writing your website code",
  },
  {
    key: "github",
    label: "Pushing to GitHub",
    description: "Creating repository and uploading files",
  },
  {
    key: "vercel_create",
    label: "Creating Deployment",
    description: "Setting up your Vercel project",
  },
  {
    key: "vercel_deploy",
    label: "Deploying Website",
    description: "Building and deploying your site",
  },
] as const

export type GenerationStepKey = (typeof GENERATION_STEPS)[number]["key"]

export function getStepIndex(key: string | null): number {
  if (!key) return -1
  return GENERATION_STEPS.findIndex((s) => s.key === key)
}

export function getStepProgress(key: string | null): number {
  if (!key) return 0
  const idx = getStepIndex(key)
  if (idx === -1) return 0
  return Math.round(((idx + 1) / GENERATION_STEPS.length) * 100)
}
