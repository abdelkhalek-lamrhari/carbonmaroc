"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "@/lib/supabase/auth-context"
import { bookingStatus, serviceLabel, type BookingRow } from "@/lib/supabase/types"

export default function MesRendezVous() {
  const { user } = useAuth()
  const [rows, setRows] = useState<BookingRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    supabase
      .from("bookings")
      .select("id, service_id, appointment_date, appointment_time, status, created_at, notes")
      .eq("user_id", user.id)
      .order("appointment_date", { ascending: false })
      .then(({ data }) => {
        setRows((data as BookingRow[]) ?? [])
        setLoading(false)
      })
  }, [user])

  if (loading) return <Loader2 className="w-8 h-8 text-primary animate-spin" />
  if (!rows.length)
    return (
      <div className="border-4 border-dashed border-primary/20 bg-black/30 py-16 px-6 text-center text-gray-400">
        Aucun rendez-vous pour l'instant.{" "}
        <Link href="/rendez-vous" className="text-primary hover:underline">En prendre un →</Link>
      </div>
    )

  return (
    <div className="space-y-4">
      {rows.map((r) => {
        const st = bookingStatus(r.status)
        return (
          <div key={r.id} className="bg-white/5 border-2 border-white/10 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="font-display text-xl text-white tracking-wide">{serviceLabel(r.service_id)}</div>
              <div className="text-gray-400 text-sm">
                {new Date(r.appointment_date).toLocaleDateString("fr-FR", { weekday: "long", day: "2-digit", month: "long" })} · {r.appointment_time}
              </div>
              {r.notes && <p className="text-gray-500 text-sm mt-1 line-clamp-2 whitespace-pre-wrap">{r.notes}</p>}
            </div>
            <span className={`px-3 py-1 text-xs font-display tracking-widest border shrink-0 ${st?.cls ?? "border-white/30 text-white"}`}>
              {st?.label ?? r.status}
            </span>
          </div>
        )
      })}
    </div>
  )
}
