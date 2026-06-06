"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "@/lib/supabase/auth-context"
import { carTypeLabel, finishLabel, quoteStatus, type QuoteRow } from "@/lib/supabase/types"

export default function MesDevis() {
  const { user } = useAuth()
  const [rows, setRows] = useState<QuoteRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    supabase
      .from("quote_requests")
      .select("id, contact_name, car_model, car_type, color_requested, finish, status, created_at, photo_url, notes")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setRows((data as QuoteRow[]) ?? [])
        setLoading(false)
      })
  }, [user])

  if (loading) return <Loader2 className="w-8 h-8 text-primary animate-spin" />
  if (!rows.length)
    return (
      <Empty>
        Aucune demande de devis pour l'instant.{" "}
        <Link href="/devis" className="text-primary hover:underline">En faire une →</Link>
      </Empty>
    )

  return (
    <div className="space-y-4">
      {rows.map((r) => {
        const st = quoteStatus(r.status)
        return (
          <div key={r.id} className="bg-white/5 border-2 border-white/10 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
            {r.photo_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={r.photo_url} alt="" className="w-16 h-16 object-cover border-2 border-primary/30 shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <div className="font-display text-xl text-white tracking-wide">{r.car_model}</div>
              <div className="text-gray-400 text-sm">
                {carTypeLabel(r.car_type)} · {finishLabel(r.finish)} · {r.color_requested}
              </div>
              {r.notes && <p className="text-gray-500 text-sm mt-1 line-clamp-2">{r.notes}</p>}
            </div>
            <div className="flex flex-col items-start sm:items-end gap-1 shrink-0">
              <span className={`px-3 py-1 text-xs font-display tracking-widest border ${st?.cls ?? "border-white/30 text-white"}`}>
                {st?.label ?? r.status}
              </span>
              <span className="text-gray-500 text-xs">{new Date(r.created_at).toLocaleDateString("fr-FR")}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-4 border-dashed border-primary/20 bg-black/30 py-16 px-6 text-center text-gray-400">
      {children}
    </div>
  )
}
