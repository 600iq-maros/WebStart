import { Badge } from "@/components/ui/badge"
import type { ProjectStatus } from "@prisma/client"

const statusConfig: Record<ProjectStatus, { label: string; className: string }> = {
  DRAFT: {
    label: "Draft",
    className: "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-100",
  },
  QUEUED: {
    label: "Queued",
    className: "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-50",
  },
  GENERATING: {
    label: "Generating",
    className: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50 animate-pulse",
  },
  DEPLOYING: {
    label: "Deploying",
    className: "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-50 animate-pulse",
  },
  LIVE: {
    label: "Live",
    className: "bg-green-50 text-green-700 border-green-200 hover:bg-green-50",
  },
  FAILED: {
    label: "Failed",
    className: "bg-red-50 text-red-700 border-red-200 hover:bg-red-50",
  },
}

export function StatusBadge({ status }: { status: ProjectStatus }) {
  const config = statusConfig[status]
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  )
}
