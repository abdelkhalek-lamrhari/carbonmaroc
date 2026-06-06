"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2, AlertTriangle } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "@/lib/supabase/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const inputClass = "bg-black/50 border-2 border-primary/30 focus:border-primary text-white h-12"
const labelClass = "text-white font-display text-lg tracking-wider"

export default function MonProfil() {
  const { user, refreshProfile, signOut } = useAuth()
  const router = useRouter()
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [city, setCity] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    if (!user) return
    supabase
      .from("profiles")
      .select("full_name, phone, city")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        setFullName(data?.full_name ?? "")
        setPhone(data?.phone ?? "")
        setCity(data?.city ?? "")
        setLoading(false)
      })
  }, [user])

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setSaving(true)
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName.trim(), phone: phone.trim() || null, city: city.trim() || null })
      .eq("id", user.id)
    setSaving(false)
    if (error) toast.error("Échec de la mise à jour.")
    else {
      toast.success("Profil mis à jour.")
      refreshProfile()
    }
  }

  const deleteAccount = async () => {
    const { error } = await supabase.functions.invoke("delete-account")
    if (error) {
      toast.error("Suppression impossible. Contacte-nous.")
      return
    }
    await signOut()
    toast.success("Compte supprimé.")
    router.replace("/")
  }

  if (loading) return <Loader2 className="w-8 h-8 text-primary animate-spin" />

  return (
    <div className="max-w-xl space-y-10">
      <form onSubmit={save} className="bg-white/5 border-2 border-white/10 p-6 space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email" className={labelClass}>EMAIL</Label>
          <Input id="email" value={user?.email ?? ""} disabled className={`${inputClass} opacity-60`} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fullName" className={labelClass}>NOM COMPLET</Label>
          <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputClass} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone" className={labelClass}>TÉLÉPHONE</Label>
          <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} placeholder="0649454288" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city" className={labelClass}>VILLE</Label>
          <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} className={inputClass} placeholder="Casablanca" />
        </div>
        <Button type="submit" size="lg" disabled={saving}
          className="font-display tracking-[0.2em] py-6 px-8 bg-primary hover:bg-primary/90 text-black border-4 border-primary disabled:opacity-50">
          {saving ? "…" : "ENREGISTRER"}
        </Button>
      </form>

      {/* Danger zone */}
      <div className="border-2 border-red-500/30 bg-red-500/5 p-6 space-y-4">
        <div className="flex items-center gap-2 text-red-400 font-display tracking-wider">
          <AlertTriangle className="w-5 h-5" /> ZONE DANGEREUSE
        </div>
        <p className="text-gray-400 text-sm">Supprimer ton compte efface définitivement tes données (devis, RDV, favoris…).</p>
        {confirmDelete ? (
          <div className="flex flex-wrap gap-3">
            <Button onClick={deleteAccount} className="font-display tracking-widest bg-red-600 hover:bg-red-700 text-white border-2 border-red-600">
              CONFIRMER LA SUPPRESSION
            </Button>
            <Button onClick={() => setConfirmDelete(false)} variant="outline" className="font-display tracking-widest border-2 border-white/20 text-gray-300 bg-transparent">
              ANNULER
            </Button>
          </div>
        ) : (
          <Button onClick={() => setConfirmDelete(true)} variant="outline"
            className="font-display tracking-widest border-2 border-red-500/40 text-red-300 hover:bg-red-500/10 bg-transparent">
            SUPPRIMER MON COMPTE
          </Button>
        )}
      </div>
    </div>
  )
}
