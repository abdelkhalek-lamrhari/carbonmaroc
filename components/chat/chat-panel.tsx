"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { Send, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import type { ChatMessage } from "@/lib/supabase/types"

interface ChatPanelProps {
  threadId: string
  senderId: string
  senderRole: "user" | "staff"
  className?: string
}

// Shared realtime conversation view used by both the staff dashboard and the client widget.
export function ChatPanel({ threadId, senderId, senderRole, className = "" }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [text, setText] = useState("")
  const [sending, setSending] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  const markRead = () => {
    const col = senderRole === "staff" ? "unread_for_staff" : "unread_for_user"
    supabase.from("chat_threads").update({ [col]: false }).eq("id", threadId)
  }

  useEffect(() => {
    let active = true
    supabase
      .from("chat_messages")
      .select("id, thread_id, sender_id, sender_role, content, created_at")
      .eq("thread_id", threadId)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        if (!active) return
        setMessages((data as ChatMessage[]) ?? [])
        setLoading(false)
        markRead()
      })

    const channel = supabase
      .channel(`chat-thread-${threadId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages", filter: `thread_id=eq.${threadId}` },
        (payload) => {
          const msg = payload.new as ChatMessage
          setMessages((prev) => (prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]))
          if (msg.sender_role !== senderRole) markRead()
        },
      )
      .subscribe()

    return () => {
      active = false
      supabase.removeChannel(channel)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threadId, senderRole])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const send = async (e: React.FormEvent) => {
    e.preventDefault()
    const content = text.trim()
    if (!content || sending) return
    setSending(true)
    setText("")
    const { data, error } = await supabase
      .from("chat_messages")
      .insert({ thread_id: threadId, sender_id: senderId, sender_role: senderRole, content })
      .select("id, thread_id, sender_id, sender_role, content, created_at")
      .single()
    setSending(false)
    if (error) {
      setText(content)
      return
    }
    const msg = data as ChatMessage
    setMessages((prev) => (prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]))
  }

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>
        ) : messages.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-8">Démarre la conversation 👇</p>
        ) : (
          messages.map((m) => {
            const mine = m.sender_role === senderRole
            return (
              <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] px-4 py-2 text-sm ${
                  mine ? "bg-primary text-black" : "bg-white/10 text-white border border-white/10"
                }`}>
                  {m.content}
                </div>
              </div>
            )
          })
        )}
        <div ref={endRef} />
      </div>
      <form onSubmit={send} className="p-3 border-t-2 border-primary/20 flex gap-2">
        <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Écris ton message…"
          className="bg-black/50 border-2 border-primary/30 focus:border-primary text-white" />
        <button type="submit" disabled={sending || !text.trim()}
          className="px-4 bg-primary text-black border-2 border-primary disabled:opacity-40 hover:bg-primary/90">
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  )
}
