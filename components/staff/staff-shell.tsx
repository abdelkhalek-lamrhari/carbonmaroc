"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { toast } from "sonner"
import {
  Loader2, LogOut, LayoutDashboard, FileText, CalendarDays, ImageIcon, Megaphone, MessageSquare, Home,
} from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "@/lib/supabase/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const nav = [
  { href: "/staff", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/staff/devis", label: "Devis", icon: FileText },
  { href: "/staff/rendez-vous", label: "Rendez-vous", icon: CalendarDays },
  { href: "/staff/galerie", label: "Galerie", icon: ImageIcon },
  { href: "/staff/bannieres", label: "Bannières", icon: Megaphone },
  { href: "/staff/chat", label: "Chat", icon: MessageSquare },
]

export function StaffShell({ children }: { children: React.ReactNode }) {
  const { user, isStaff, loading, profile, signOut } = useAuth()
  const pathname = usePathname()

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    )
  }

  if (!user) return <StaffLogin />

  // profile may still be loading right after auth — wait for it
  if (profile === null) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    )
  }

  if (!isStaff) return <AccessDenied email={user.email ?? ""} onSignOut={signOut} />

  return (
    <div className="min-h-screen gradient-bg">
      <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />
      <header className="relative border-b-4 border-primary/30 bg-black/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="px-4 lg:px-8 py-4 flex items-center justify-between gap-4">
          <h1 className="font-display text-2xl text-white tracking-wider">CARBON <span className="text-primary">STAFF</span></h1>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm hidden sm:block">{user.email}</span>
            <Link href="/" className="text-gray-300 hover:text-primary border-2 border-primary/30 hover:border-primary p-2" aria-label="Site"><Home className="w-4 h-4" /></Link>
            <button onClick={() => signOut()} className="text-gray-300 hover:text-primary border-2 border-primary/30 hover:border-primary p-2" aria-label="Déconnexion"><LogOut className="w-4 h-4" /></button>
          </div>
        </div>
        {/* horizontal nav */}
        <nav className="px-4 lg:px-8 flex gap-1 overflow-x-auto">
          {nav.map((n) => {
            const active = n.exact ? pathname === n.href : pathname.startsWith(n.href)
            return (
              <Link key={n.href} href={n.href}
                className={`flex items-center gap-2 px-4 py-3 font-display tracking-wider text-sm whitespace-nowrap border-b-4 transition-all ${
                  active ? "border-primary text-primary" : "border-transparent text-gray-400 hover:text-white"
                }`}>
                <n.icon className="w-4 h-4" /> {n.label}
              </Link>
            )
          })}
        </nav>
      </header>
      <main className="relative px-4 lg:px-8 py-8">{children}</main>
    </div>
  )
}

function StaffLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password })
    setLoading(false)
    if (error) toast.error("Identifiants invalides.")
  }

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <form onSubmit={onSubmit}
        className="relative w-full max-w-md bg-gradient-to-br from-gray-900 via-black to-gray-900 border-4 border-primary/50 shadow-[0_0_50px_rgba(var(--primary),0.2)] p-8 space-y-6">
        <div>
          <h1 className="font-display text-4xl text-white tracking-wider">ESPACE <span className="text-primary neon-text">STAFF</span></h1>
          <p className="text-gray-400 text-sm mt-2">Connexion réservée à l'équipe Carbon Maroc.</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-white font-display text-lg tracking-wider">EMAIL</Label>
          <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            className="bg-black/50 border-2 border-primary/30 focus:border-primary text-white h-12" placeholder="staff@email.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-white font-display text-lg tracking-wider">MOT DE PASSE</Label>
          <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
            className="bg-black/50 border-2 border-primary/30 focus:border-primary text-white h-12" placeholder="••••••••" />
        </div>
        <Button type="submit" size="lg" disabled={loading}
          className="w-full font-display tracking-[0.2em] text-lg py-6 bg-primary hover:bg-primary/90 text-black border-4 border-primary disabled:opacity-50">
          {loading ? "CONNEXION…" : "SE CONNECTER"}
        </Button>
      </form>
    </div>
  )
}

function AccessDenied({ email, onSignOut }: { email: string; onSignOut: () => void }) {
  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4 text-center">
      <div className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 border-4 border-red-500/50 p-10 max-w-md space-y-6">
        <h1 className="font-display text-4xl text-white tracking-wider">ACCÈS REFUSÉ</h1>
        <p className="text-gray-400">Le compte <span className="text-white">{email}</span> n'a pas les droits staff.</p>
        <Button onClick={onSignOut} size="lg" className="font-display tracking-[0.2em] bg-primary hover:bg-primary/90 text-black border-4 border-primary">
          <LogOut className="w-5 h-5 mr-2" /> SE DÉCONNECTER
        </Button>
      </div>
    </div>
  )
}
