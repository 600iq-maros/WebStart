import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { ChatContainer } from "@/components/chat/chat-container"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function ChatPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const project = await prisma.project.findFirst({
    where: { id, userId: session.user.id, status: "LIVE" },
  })

  if (!project || !project.deploymentUrl) {
    redirect("/dashboard")
  }

  const rawMessages = await prisma.chatMessage.findMany({
    where: { projectId: project.id },
    orderBy: { createdAt: "asc" },
  })

  const messages = rawMessages.map((m) => ({
    ...m,
    metadata: m.metadata as Record<string, unknown> | null,
  }))

  return (
    <div className="h-[calc(100vh-8rem)]">
      <Link
        href={`/projects/${project.id}`}
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back to Project
      </Link>
      <div className="h-[calc(100%-2.5rem)] rounded-lg border bg-background overflow-hidden">
        <ChatContainer
          projectId={project.id}
          projectName={project.name}
          deploymentUrl={project.deploymentUrl}
          initialMessages={messages}
        />
      </div>
    </div>
  )
}
