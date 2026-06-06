"use client"

import type React from "react"
import { useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Loader2, FileText, CalendarDays, Heart, Palette, UserCog, LogOut } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/supabase/auth-context"

const tabs = [
  { href: "/mon-compte", label: "Tableau de bord", icon: UserCog, exact: true },
  { href: "/mon-compte/devis", label: "Mes devis", icon: FileText },
  { href: "/mon-compte/rendez-vous", label: "Mes rendez-vous", icon: CalendarDays },
  { href: "/mon-compte/favoris", label: "Mes favoris", icon: Heart },
  { href: "/mon-compte/configurations", label: "Mes configs", icon: Palette },
  { href: "/mon-compte/profil", label: "Mon profil", icon: UserCog },
]

export default function MonCompteLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, loading, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !user) router.replace("/login?redirect=/mon-compte")
  }, [loading, user, router])

  if (loading || !user) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <main className="min-h-screen gradient-bg">
      <SiteHeader />
      <section className="relative pt-32 md:pt-40 pb-20">
        <div className="absolute inset-0 grid-pattern opacity-10" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="mb-8">
            <h1 className="font-display text-4xl md:text-6xl text-white tracking-wider">
              MON <span className="text-primary neon-text">COMPTE</span>
            </h1>
            <p className="text-gray-400 mt-2">Bonjour {profile?.full_name || user.email} 👋</p>
          </div>

          <div className="grid lg:grid-cols-[260px_1fr] gap-8">
            {/* Sidebar */}
            <aside className="space-y-2">
              {tabs.map((t) => {
                const active = t.exact ? pathname === t.href : pathname.startsWith(t.href)
                return (
                  <Link key={t.href} href={t.href}
                    className={`flex items-center gap-3 px-4 py-3 font-display tracking-wider text-sm border-2 transition-all ${
                      active ? "bg-primary text-black border-primary" : "bg-white/5 text-gray-300 border-white/10 hover:border-primary/50"
                    }`}>
                    <t.icon className="w-5 h-5" /> {t.label}
                  </Link>
                )
              })}
              {profile?.is_staff && (
                <Link href="/staff"
                  className="flex items-center gap-3 px-4 py-3 font-display tracking-wider text-sm border-2 bg-secondary/10 text-secondary border-secondary/40 hover:border-secondary transition-all">
                  <UserCog className="w-5 h-5" /> Espace staff
                </Link>
              )}
              <Button onClick={() => signOut()} variant="outline"
                className="w-full justify-start gap-3 px-4 py-6 font-display tracking-wider text-sm border-2 border-white/10 text-gray-300 hover:border-red-500/50 hover:text-red-300 bg-transparent">
                <LogOut className="w-5 h-5" /> Déconnexion
              </Button>
            </aside>

            {/* Content */}
            <div className="min-w-0">{children}</div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
