import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

function SkeletonCard() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="h-5 w-32 animate-pulse rounded bg-muted" />
        <div className="h-5 w-16 animate-pulse rounded bg-muted" />
      </CardHeader>
      <CardContent>
        <div className="h-4 w-24 animate-pulse rounded bg-muted" />
      </CardContent>
      <CardFooter>
        <div className="h-8 w-20 animate-pulse rounded bg-muted" />
      </CardFooter>
    </Card>
  )
}

export default function DashboardLoading() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="h-8 w-48 animate-pulse rounded bg-muted" />
          <div className="h-4 w-64 animate-pulse rounded bg-muted mt-2" />
        </div>
        <div className="h-10 w-32 animate-pulse rounded bg-muted" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  )
}
