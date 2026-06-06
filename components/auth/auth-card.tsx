"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase/client"
import { SiteHeader } from "@/components/site-header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const inputClass =
  "bg-black/50 border-2 border-primary/30 focus:border-primary text-white placeholder:text-gray-600 h-12"
const labelClass = "text-white font-display text-lg tracking-wider"

export function AuthCard({ mode }: { mode: "login" | "signup" }) {
  const isSignup = mode === "signup"
  const router = useRouter()
  const params = useSearchParams()
  const redirectTo = params.get("redirect") || "/mon-compte"

  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [pendingConfirm, setPendingConfirm] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (isSignup) {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
          options: { data: { full_name: fullName.trim(), phone: phone.trim() } },
        })
        if (error) throw error
        if (data.session) {
          toast.success("Compte créé ! Bienvenue chez Carbon Maroc.")
          router.push(redirectTo)
        } else {
          setPendingConfirm(true)
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        })
        if (error) throw error
        toast.success("Connecté !")
        router.push(redirectTo)
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erreur"
      toast.error(
        isSignup ? `Inscription impossible : ${msg}` : "Email ou mot de passe invalide.",
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen gradient-bg flex flex-col">
      <SiteHeader />
      <section className="relative flex-1 flex items-center justify-center px-4 pt-32 pb-20">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/5 blur-[100px] rounded-full" />

        <div className="relative w-full max-w-md bg-gradient-to-br from-gray-900 via-black to-gray-900 border-4 border-primary/50 shadow-[0_0_50px_rgba(var(--primary),0.15)] p-8 transform -rotate-1">
          <div className="transform rotate-1">
            <h1 className="font-display text-4xl md:text-5xl text-white tracking-wider mb-2">
              {isSignup ? (
                <>CRÉER UN <span className="text-primary neon-text">COMPTE</span></>
              ) : (
                <>SE <span className="text-primary neon-text">CONNECTER</span></>
              )}
            </h1>
            <p className="text-gray-400 text-sm mb-8">
              {isSignup ? "Rejoins Carbon Maroc pour suivre tes demandes." : "Accède à ton espace client."}
            </p>

            {pendingConfirm ? (
              <div className="space-y-6">
                <p className="text-gray-300 leading-relaxed">
                  On t'a envoyé un email de confirmation à <span className="text-primary">{email}</span>. Clique sur le
                  lien pour activer ton compte, puis connecte-toi.
                </p>
                <Link href="/login">
                  <Button size="lg" className="w-full font-display tracking-[0.2em] py-6 bg-primary hover:bg-primary/90 text-black border-4 border-primary">
                    ALLER À LA CONNEXION
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-5">
                {isSignup && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className={labelClass}>NOM COMPLET *</Label>
                      <Input id="fullName" required value={fullName} onChange={(e) => setFullName(e.target.value)}
                        className={inputClass} placeholder="Ton nom" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className={labelClass}>TÉLÉPHONE</Label>
                      <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                        className={inputClass} placeholder="0649454288" />
                    </div>
                  </>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email" className={labelClass}>EMAIL *</Label>
                  <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    className={inputClass} placeholder="email@email.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className={labelClass}>MOT DE PASSE *</Label>
                  <Input id="password" type="password" required minLength={6} value={password}
                    onChange={(e) => setPassword(e.target.value)} className={inputClass} placeholder="••••••••" />
                </div>

                <Button type="submit" size="lg" disabled={loading}
                  className="w-full font-display tracking-[0.2em] text-lg py-6 bg-primary hover:bg-primary/90 text-black border-4 border-primary disabled:opacity-50">
                  {loading ? "…" : isSignup ? "CRÉER MON COMPTE" : "SE CONNECTER"}
                </Button>

                <p className="text-center text-sm text-gray-500 pt-2">
                  {isSignup ? (
                    <>Déjà un compte ?{" "}
                      <Link href="/login" className="text-primary hover:underline">Se connecter</Link>
                    </>
                  ) : (
                    <>Pas encore de compte ?{" "}
                      <Link href="/signup" className="text-primary hover:underline">Créer un compte</Link>
                    </>
                  )}
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
