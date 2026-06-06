"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Loader2, MessageSquare } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import type { ChatThread } from "@/lib/supabase/types"

type ThreadWithName = ChatThread & { name: string }

export default function StaffChatList() {
  const [threads, setThreads] = useState<ThreadWithName[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      const { data } = await supabase
        .from("chat_threads")
        .select("id, user_id, last_message, last_message_at, unread_for_user, unread_for_staff, created_at")
        .order("last_message_at", { ascending: false, nullsFirst: false })
      const list = (data as ChatThread[]) ?? []
      const ids = [...new Set(list.map((t) => t.user_id))]
      let names: Record<string, string> = {}
      if (ids.length) {
        const { data: profs } = await supabase.from("profiles").select("id, full_name, phone").in("id", ids)
        names = Object.fromEntries((profs ?? []).map((p: { id: string; full_name: string | null; phone: string | null }) => [p.id, p.full_name || p.phone || "Client"]))
      }
      setThreads(list.map((t) => ({ ...t, name: names[t.user_id] ?? "Client" })))
      setLoading(false)
    })()
  }, [])

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 text-primary animate-spin" /></div>

  return (
    <div>
      <h2 className="font-display text-3xl text-white tracking-wider mb-6">CHAT ({threads.length})</h2>
      {threads.length === 0 ? (
        <div className="border-4 border-dashed border-primary/20 bg-black/30 py-20 text-center text-gray-500 font-display tracking-widest">AUCUNE CONVERSATION</div>
      ) : (
        <div className="space-y-3 max-w-3xl">
          {threads.map((t) => (
            <Link key={t.id} href={`/staff/chat/${t.id}`}
              className={`flex items-center gap-4 p-4 border-2 transition-all hover:border-primary ${
                t.unread_for_staff ? "bg-primary/10 border-primary/50" : "bg-white/5 border-white/10"
              }`}>
              <div className="w-11 h-11 bg-primary/15 border-2 border-primary/40 flex items-center justify-center shrink-0">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-display text-lg text-white">{t.name}</span>
                  {t.unread_for_staff && <span className="w-2 h-2 rounded-full bg-primary" />}
                </div>
                <p className="text-gray-400 text-sm truncate">{t.last_message || "—"}</p>
              </div>
              <span className="text-gray-600 text-xs shrink-0">
                {t.last_message_at ? new Date(t.last_message_at).toLocaleDateString("fr-FR") : ""}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
