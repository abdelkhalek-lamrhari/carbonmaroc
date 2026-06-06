"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { FileText, CalendarDays, Heart, ArrowRight } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "@/lib/supabase/auth-context"

export default function MonCompteHome() {
  const { user } = useAuth()
  const [counts, setCounts] = useState({ devis: 0, rdv: 0, favoris: 0 })

  useEffect(() => {
    if (!user) return
    const head = { count: "exact" as const, head: true }
    Promise.all([
      supabase.from("quote_requests").select("id", head).eq("user_id", user.id),
      supabase.from("bookings").select("id", head).eq("user_id", user.id),
      supabase.from("favorites").select("id", head).eq("user_id", user.id),
    ]).then(([q, b, f]) => setCounts({ devis: q.count ?? 0, rdv: b.count ?? 0, favoris: f.count ?? 0 }))
  }, [user])

  const cards = [
    { href: "/mon-compte/devis", label: "Mes demandes de devis", value: counts.devis, icon: FileText },
    { href: "/mon-compte/rendez-vous", label: "Mes rendez-vous", value: counts.rdv, icon: CalendarDays },
    { href: "/mon-compte/favoris", label: "Mes favoris", value: counts.favoris, icon: Heart },
  ]

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((c) => (
        <Link key={c.href} href={c.href}
          className="group bg-gradient-to-br from-gray-900 to-black border-4 border-primary/30 hover:border-primary p-6 transition-all hover:scale-[1.02]">
          <c.icon className="w-10 h-10 text-primary mb-4" strokeWidth={1.5} />
          <div className="font-display text-5xl text-white">{c.value}</div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-gray-400 text-sm">{c.label}</span>
            <ArrowRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </Link>
      ))}
    </div>
  )
}
