"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "@/lib/supabase/auth-context"
import { ChatPanel } from "@/components/chat/chat-panel"

export default function StaffChatThread({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { user } = useAuth()
  const [clientName, setClientName] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [exists, setExists] = useState(false)

  useEffect(() => {
    ;(async () => {
      const { data: thread } = await supabase.from("chat_threads").select("user_id").eq("id", id).maybeSingle()
      if (thread) {
        setExists(true)
        const { data: prof } = await supabase
          .from("profiles").select("full_name, phone").eq("id", thread.user_id).maybeSingle()
        setClientName(prof?.full_name || prof?.phone || "Client")
      }
      setLoading(false)
    })()
  }, [id])

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 text-primary animate-spin" /></div>

  return (
    <div className="max-w-3xl">
      <Link href="/staff/chat" className="inline-flex items-center gap-2 text-gray-400 hover:text-primary font-display tracking-widest mb-4">
        <ArrowLeft size={18} /> CONVERSATIONS
      </Link>
      {!exists || !user ? (
        <div className="border-4 border-dashed border-primary/20 bg-black/30 py-20 text-center text-gray-500 font-display tracking-widest">CONVERSATION INTROUVABLE</div>
      ) : (
        <div className="border-2 border-primary/30 bg-black/40 h-[70vh] flex flex-col">
          <div className="px-4 py-3 border-b-2 border-primary/20 font-display text-xl text-white tracking-wider">{clientName}</div>
          <ChatPanel threadId={id} senderId={user.id} senderRole="staff" className="flex-1 min-h-0" />
        </div>
      )}
    </div>
  )
}
