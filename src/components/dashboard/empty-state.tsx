import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FolderPlus } from "lucide-react"

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
      <FolderPlus className="h-12 w-12 text-muted-foreground/50 mb-4" />
      <h3 className="text-lg font-semibold">No projects yet</h3>
      <p className="text-sm text-muted-foreground mt-1 mb-4">
        Create your first AI-generated website in minutes.
      </p>
      <Link href="/projects/new">
        <Button>Create your first project</Button>
      </Link>
    </div>
  )
}
