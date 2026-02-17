import { cn } from "@/lib/utils"
import { User, Bot } from "lucide-react"

interface ChatMessageProps {
  role: string
  content: string
  metadata?: {
    filesUpdated?: string[]
    filesCreated?: string[]
    filesDeleted?: string[]
  } | null
}

export function ChatMessage({ role, content, metadata }: ChatMessageProps) {
  const isUser = role === "user"

  return (
    <div className={cn("flex gap-3", isUser ? "flex-row-reverse" : "flex-row")}>
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          isUser ? "bg-primary text-primary-foreground" : "bg-muted"
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      <div
        className={cn(
          "rounded-lg px-4 py-2.5 max-w-[80%]",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground"
        )}
      >
        <p className="text-sm whitespace-pre-wrap">{content}</p>
        {metadata && !isUser && (
          <div className="mt-2 border-t border-border/30 pt-2">
            {metadata.filesUpdated && metadata.filesUpdated.length > 0 && (
              <p className="text-xs opacity-70">
                Updated: {metadata.filesUpdated.join(", ")}
              </p>
            )}
            {metadata.filesCreated && metadata.filesCreated.length > 0 && (
              <p className="text-xs opacity-70">
                Created: {metadata.filesCreated.join(", ")}
              </p>
            )}
            {metadata.filesDeleted && metadata.filesDeleted.length > 0 && (
              <p className="text-xs opacity-70">
                Deleted: {metadata.filesDeleted.join(", ")}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
