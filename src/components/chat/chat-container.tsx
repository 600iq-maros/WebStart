"use client"

import { useState, useRef, useEffect } from "react"
import { ChatMessage } from "./chat-message"
import { ChatInput } from "./chat-input"
import { Button } from "@/components/ui/button"
import { ExternalLink, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface Message {
  id: string
  role: string
  content: string
  metadata?: Record<string, unknown> | null
  createdAt: Date
}

interface ChatContainerProps {
  projectId: string
  projectName: string
  deploymentUrl: string
  initialMessages: Message[]
}

export function ChatContainer({
  projectId,
  projectName,
  deploymentUrl,
  initialMessages,
}: ChatContainerProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    })
  }, [messages])

  const handleSend = async (content: string) => {
    // Add user message optimistically
    const userMessage: Message = {
      id: `temp-${Date.now()}`,
      role: "user",
      content,
      metadata: null,
      createdAt: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      const res = await fetch(`/api/chat/${projectId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Failed to process changes")
      }

      const data = await res.json()

      const assistantMessage: Message = {
        id: `temp-${Date.now()}-reply`,
        role: "assistant",
        content: data.explanation,
        metadata: { filesChanged: data.filesChanged },
        createdAt: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
      toast.success("Changes committed! Site will redeploy shortly.")
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      )
      // Remove the optimistic user message on error
      setMessages((prev) =>
        prev.filter((m) => m.id !== userMessage.id)
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div>
          <h2 className="font-semibold">{projectName}</h2>
          <p className="text-xs text-muted-foreground">
            Describe changes and they will be applied automatically
          </p>
        </div>
        <a href={deploymentUrl} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="sm">
            <ExternalLink className="mr-1 h-3 w-3" />
            View Site
          </Button>
        </a>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            Send a message to start editing your website
          </div>
        )}
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            role={message.role}
            content={message.content}
            metadata={message.metadata as { filesUpdated?: string[]; filesCreated?: string[]; filesDeleted?: string[] } | null}
          />
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Loader2 className="h-4 w-4 animate-spin" />
            Applying changes...
          </div>
        )}
      </div>

      <ChatInput onSend={handleSend} disabled={isLoading} />
    </div>
  )
}
