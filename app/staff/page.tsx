"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { FileText, CalendarDays, ImageIcon, MessageSquare, ArrowRight } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

export default function StaffDashboard() {
  const [counts, setCounts] = useState({ newQuotes: 0, pendingBookings: 0, projects: 0, unreadChats: 0 })

  useEffect(() => {
    const head = { count: "exact" as const, head: true }
    Promise.all([
      supabase.from("quote_requests").select("id", head).eq("status", "new"),
      supabase.from("bookings").select("id", head).eq("status", "pending"),
      supabase.from("projects").select("id", head),
      supabase.from("chat_threads").select("id", head).eq("unread_for_staff", true),
    ]).then(([q, b, p, c]) =>
      setCounts({
        newQuotes: q.count ?? 0,
        pendingBookings: b.count ?? 0,
        projects: p.count ?? 0,
        unreadChats: c.count ?? 0,
      }),
    )
  }, [])

  const cards = [
    { href: "/staff/devis", label: "Nouvelles demandes de devis", value: counts.newQuotes, icon: FileText },
    { href: "/staff/rendez-vous", label: "RDV en attente", value: counts.pendingBookings, icon: CalendarDays },
    { href: "/staff/galerie", label: "Projets dans la galerie", value: counts.projects, icon: ImageIcon },
    { href: "/staff/chat", label: "Conversations non lues", value: counts.unreadChats, icon: MessageSquare },
  ]

  return (
    <div>
      <h2 className="font-display text-3xl text-white tracking-wider mb-6">TABLEAU DE BORD</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((c) => (
          <Link key={c.href} href={c.href}
            className="group bg-gradient-to-br from-gray-900 to-black border-4 border-primary/30 hover:border-primary p-6 transition-all hover:scale-[1.02]">
            <c.icon className="w-9 h-9 text-primary mb-4" strokeWidth={1.5} />
            <div className="font-display text-5xl text-white">{c.value}</div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-gray-400 text-sm">{c.label}</span>
              <ArrowRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
