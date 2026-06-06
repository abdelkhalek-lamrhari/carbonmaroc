"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { MessageCircle, X, Send, Loader2, Bot, Headset } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "@/lib/supabase/auth-context"
import { useLanguage } from "@/lib/i18n/language-context"
import { Input } from "@/components/ui/input"
import { ChatPanel } from "@/components/chat/chat-panel"

type AIMsg = { role: "user" | "assistant"; content: string }

export function FloatingChat() {
  const { user } = useAuth()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<"ai" | "support">("ai")

  // Staff area has its own chat UI — don't show the floating widget there.
  if (pathname?.startsWith("/staff")) return null

  return (
    <>
      {/* Bubble */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Chat"
        className="fixed bottom-5 right-5 z-[90] w-14 h-14 rounded-full bg-primary text-black shadow-[0_0_30px_rgba(var(--primary),0.5)] flex items-center justify-center hover:scale-110 transition-transform"
      >
        {open ? <X className="w-6 h-6" strokeWidth={3} /> : <MessageCircle className="w-6 h-6" strokeWidth={2.5} />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 z-[90] w-[92vw] max-w-sm h-[70vh] max-h-[560px] bg-gradient-to-br from-gray-900 via-black to-gray-900 border-4 border-primary/50 shadow-[0_0_50px_rgba(0,0,0,0.6)] flex flex-col animate-in slide-in-from-bottom-4 duration-200">
          {/* Header + tabs */}
          <div className="border-b-2 border-primary/30">
            <div className="px-4 pt-3 pb-2">
              <h3 className="font-display text-xl text-white tracking-wider">CARBON <span className="text-primary">CHAT</span></h3>
            </div>
            <div className="flex">
              <TabBtn active={tab === "ai"} onClick={() => setTab("ai")} icon={<Bot className="w-4 h-4" />} label="Assistant IA" />
              <TabBtn active={tab === "support"} onClick={() => setTab("support")} icon={<Headset className="w-4 h-4" />} label="Support" />
            </div>
          </div>

          {tab === "ai" ? <AIChat userId={user?.id ?? null} /> : <SupportChat userId={user?.id ?? null} />}
        </div>
      )}
    </>
  )
}

function TabBtn({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 py-2.5 font-display tracking-widest text-xs border-b-4 transition-all ${
        active ? "border-primary text-primary" : "border-transparent text-gray-400 hover:text-white"
      }`}>
      {icon} {label}
    </button>
  )
}

/* ------------------------------- AI (Mistral) ------------------------------ */

function AIChat({ userId }: { userId: string | null }) {
  const { d } = useLanguage()
  const [messages, setMessages] = useState<AIMsg[]>([{ role: "assistant", content: d.chat.greeting }])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }) }, [messages])

  const send = async (e: React.FormEvent) => {
    e.preventDefault()
    const content = input.trim()
    if (!content || loading) return
    const next = [...messages, { role: "user" as const, content }]
    setMessages(next)
    setInput("")
    setLoading(true)
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.slice(-20) }),
      })
      if (!res.ok) throw new Error("api")
      const data = await res.json()
      const reply: string = data?.reply ?? ""
      if (!reply) throw new Error("empty")
      const updated = [...next, { role: "assistant" as const, content: reply }]
      setMessages(updated)
      // Persist (best effort) — ai_conversations is one row per message (role + content).
      if (userId) {
        supabase.from("ai_conversations").insert([
          { user_id: userId, role: "user", content },
          { user_id: userId, role: "assistant", content: reply },
        ])
      }
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: d.chat.errorFallback }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] px-4 py-2 text-sm ${m.role === "user" ? "bg-primary text-black" : "bg-white/10 text-white border border-white/10"}`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && <div className="flex justify-start"><div className="bg-white/10 border border-white/10 px-4 py-2"><Loader2 className="w-4 h-4 text-primary animate-spin" /></div></div>}
        <div ref={endRef} />
      </div>
      <form onSubmit={send} className="p-3 border-t-2 border-primary/20 flex gap-2">
        <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder={d.chat.placeholder}
          className="bg-black/50 border-2 border-primary/30 focus:border-primary text-white" />
        <button type="submit" disabled={loading || !input.trim()} className="px-4 bg-primary text-black border-2 border-primary disabled:opacity-40 hover:bg-primary/90">
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  )
}

/* ----------------------------- Support (staff) ----------------------------- */

function SupportChat({ userId }: { userId: string | null }) {
  const [threadId, setThreadId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) { setLoading(false); return }
    ;(async () => {
      const { data: existing } = await supabase
        .from("chat_threads").select("id").eq("user_id", userId).maybeSingle()
      if (existing) {
        setThreadId(existing.id)
      } else {
        const { data: created } = await supabase
          .from("chat_threads").insert({ user_id: userId }).select("id").single()
        setThreadId(created?.id ?? null)
      }
      setLoading(false)
    })()
  }, [userId])

  if (!userId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-6 gap-4">
        <Headset className="w-12 h-12 text-primary" />
        <p className="text-gray-300">Connecte-toi pour discuter en direct avec notre équipe.</p>
        <Link href="/login?redirect=/" className="font-display tracking-widest px-6 py-3 bg-primary text-black border-2 border-primary">SE CONNECTER</Link>
      </div>
    )
  }
  if (loading || !threadId) return <div className="flex-1 flex items-center justify-center"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>
  return <ChatPanel threadId={threadId} senderId={userId} senderRole="user" className="flex-1 min-h-0" />
}
