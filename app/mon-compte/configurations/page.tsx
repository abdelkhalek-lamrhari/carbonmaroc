"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "@/lib/supabase/auth-context"
import { carTypeLabel, type SavedConfiguration } from "@/lib/supabase/types"

export default function MesConfigurations() {
  const { user } = useAuth()
  const [rows, setRows] = useState<SavedConfiguration[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    supabase
      .from("saved_configurations")
      .select("id, name, car_name, car_type, color_label, color_value, finish_label, finish_id, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setRows((data as SavedConfiguration[]) ?? [])
        setLoading(false)
      })
  }, [user])

  if (loading) return <Loader2 className="w-8 h-8 text-primary animate-spin" />
  if (!rows.length)
    return (
      <div className="border-4 border-dashed border-primary/20 bg-black/30 py-16 px-6 text-center text-gray-400">
        Aucune configuration sauvegardée. Crée-en depuis le customizer de l'app mobile.
      </div>
    )

  return (
    <div className="grid sm:grid-cols-2 gap-5">
      {rows.map((c) => (
        <div key={c.id} className="bg-white/5 border-2 border-white/10 p-5">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-10 h-10 border-2 border-white/30 shrink-0" style={{ backgroundColor: c.color_value }} />
            <div className="min-w-0">
              <div className="font-display text-xl text-white truncate">{c.name || c.car_name}</div>
              <div className="text-gray-400 text-sm">{c.car_name} · {carTypeLabel(c.car_type)}</div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-3 py-1 bg-primary/15 border border-primary/40 text-primary font-display tracking-widest">{c.finish_label}</span>
            <span className="px-3 py-1 bg-white/5 border border-white/20 text-gray-300 font-display tracking-widest">{c.color_label}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
