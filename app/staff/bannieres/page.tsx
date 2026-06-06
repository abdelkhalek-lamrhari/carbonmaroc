"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Loader2, Plus, Pencil, Trash2, Eye, EyeOff, X } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { LINK_TYPE_OPTIONS, type PromoBanner } from "@/lib/supabase/types"

const inputClass = "bg-black/50 border-2 border-primary/30 focus:border-primary text-white h-11"
const labelClass = "text-white font-display text-sm tracking-wider"

const emptyForm = {
  badge: "NOUVEAU", title: "", body: "", cta_label: "DÉCOUVRIR",
  link_type: "none", link_target: "", accent_color: "#00E676",
  display_order: "0", is_active: true,
}

export default function StaffBannieres() {
  const [rows, setRows] = useState<PromoBanner[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<PromoBanner | null>(null)
  const [showForm, setShowForm] = useState(false)

  const load = () =>
    supabase
      .from("promo_banners")
      .select("id, badge, title, body, cta_label, link_type, link_target, accent_color, is_active, display_order")
      .order("display_order", { ascending: true })
      .then(({ data }) => { setRows((data as PromoBanner[]) ?? []); setLoading(false) })

  useEffect(() => { load() }, [])

  const toggleActive = async (b: PromoBanner) => {
    const prev = rows
    setRows((rs) => rs.map((r) => (r.id === b.id ? { ...r, is_active: !r.is_active } : r)))
    const { error } = await supabase.from("promo_banners").update({ is_active: !b.is_active }).eq("id", b.id)
    if (error) { toast.error("Échec."); setRows(prev) }
  }

  const remove = async (b: PromoBanner) => {
    if (!confirm(`Supprimer la bannière "${b.title}" ?`)) return
    const { error } = await supabase.from("promo_banners").delete().eq("id", b.id)
    if (error) toast.error("Suppression échouée.")
    else { toast.success("Bannière supprimée."); setRows((rs) => rs.filter((r) => r.id !== b.id)) }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2 gap-4">
        <h2 className="font-display text-3xl text-white tracking-wider">BANNIÈRES ({rows.length})</h2>
        <Button onClick={() => { setEditing(null); setShowForm(true) }} className="font-display tracking-widest bg-primary hover:bg-primary/90 text-black border-2 border-primary">
          <Plus className="w-4 h-4 mr-1" /> NOUVELLE
        </Button>
      </div>
      <p className="text-gray-500 text-sm mb-6">Ces bannières s'affichent sur l'accueil de l'app mobile.</p>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 text-primary animate-spin" /></div>
      ) : (
        <div className="space-y-4">
          {rows.map((b) => (
            <div key={b.id} className="bg-white/5 border-2 border-white/10 p-5 flex flex-col sm:flex-row sm:items-center gap-4"
              style={{ borderLeftColor: b.accent_color ?? undefined, borderLeftWidth: 6 }}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  {b.badge && <span className="px-2 py-0.5 text-xs font-display tracking-widest text-black" style={{ backgroundColor: b.accent_color ?? "#00E676" }}>{b.badge}</span>}
                  <span className="font-display text-xl text-white">{b.title}</span>
                  <span className="text-gray-600 text-xs">#{b.display_order}</span>
                </div>
                {b.body && <p className="text-gray-400 text-sm mt-1">{b.body}</p>}
                <p className="text-gray-600 text-xs mt-1">{b.cta_label} · lien: {b.link_type}{b.link_target ? ` → ${b.link_target}` : ""}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => toggleActive(b)} className="p-2 border-2 border-white/15 text-gray-300 hover:border-primary hover:text-primary" title={b.is_active ? "Désactiver" : "Activer"}>
                  {b.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button onClick={() => { setEditing(b); setShowForm(true) }} className="p-2 border-2 border-white/15 text-gray-300 hover:border-primary hover:text-primary"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => remove(b)} className="p-2 border-2 border-white/15 text-gray-300 hover:border-red-500 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <BannerForm banner={editing}
          nextOrder={rows.length ? Math.max(...rows.map((r) => r.display_order)) + 1 : 0}
          onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); load() }} />
      )}
    </div>
  )
}

function BannerForm({
  banner, nextOrder, onClose, onSaved,
}: { banner: PromoBanner | null; nextOrder: number; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState(
    banner
      ? { badge: banner.badge ?? "", title: banner.title, body: banner.body ?? "", cta_label: banner.cta_label ?? "",
          link_type: banner.link_type ?? "none", link_target: banner.link_target ?? "",
          accent_color: banner.accent_color ?? "#00E676", display_order: String(banner.display_order), is_active: banner.is_active }
      : { ...emptyForm, display_order: String(nextOrder) },
  )
  const [saving, setSaving] = useState(false)
  const set = (k: keyof typeof form, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const payload = {
      badge: form.badge.trim() || null, title: form.title.trim(), body: form.body.trim() || null,
      cta_label: form.cta_label.trim() || null, link_type: form.link_type,
      link_target: form.link_target.trim() || null, accent_color: form.accent_color,
      display_order: Number(form.display_order) || 0, is_active: form.is_active,
    }
    const res = banner
      ? await supabase.from("promo_banners").update(payload).eq("id", banner.id)
      : await supabase.from("promo_banners").insert(payload)
    setSaving(false)
    if (res.error) toast.error("Échec : " + res.error.message)
    else { toast.success(banner ? "Bannière mise à jour." : "Bannière créée."); onSaved() }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />
      <form onSubmit={submit}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-gray-900 via-black to-gray-900 border-4 border-primary/50 p-6 md:p-8 space-y-5">
        <button type="button" onClick={onClose} className="absolute top-4 right-4 text-white hover:text-primary"><X size={28} strokeWidth={3} /></button>
        <h3 className="font-display text-3xl text-white tracking-wider">{banner ? "MODIFIER" : "NOUVELLE"} <span className="text-primary">BANNIÈRE</span></h3>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2"><Label className={labelClass}>BADGE</Label>
            <Input value={form.badge} onChange={(e) => set("badge", e.target.value)} className={inputClass} placeholder="NOUVEAU" /></div>
          <div className="space-y-2"><Label className={labelClass}>TITRE *</Label>
            <Input required value={form.title} onChange={(e) => set("title", e.target.value)} className={inputClass} /></div>
        </div>
        <div className="space-y-2"><Label className={labelClass}>TEXTE (ligne 2)</Label>
          <Textarea value={form.body} onChange={(e) => set("body", e.target.value)} className="bg-black/50 border-2 border-primary/30 text-white min-h-[70px] resize-none" /></div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2"><Label className={labelClass}>TEXTE DU BOUTON</Label>
            <Input value={form.cta_label} onChange={(e) => set("cta_label", e.target.value)} className={inputClass} /></div>
          <div className="space-y-2"><Label className={labelClass}>COULEUR D'ACCENT</Label>
            <div className="flex gap-2 items-center">
              <input type="color" value={form.accent_color} onChange={(e) => set("accent_color", e.target.value)} className="h-11 w-14 bg-transparent border-2 border-primary/30" />
              <Input value={form.accent_color} onChange={(e) => set("accent_color", e.target.value)} className={inputClass} />
            </div></div>
          <div className="space-y-2"><Label className={labelClass}>TYPE DE LIEN</Label>
            <select value={form.link_type} onChange={(e) => set("link_type", e.target.value)} className="w-full bg-black/50 border-2 border-primary/30 text-white h-11 px-3 rounded-md">
              {LINK_TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select></div>
          <div className="space-y-2"><Label className={labelClass}>CIBLE DU LIEN</Label>
            <Input value={form.link_target} onChange={(e) => set("link_target", e.target.value)} className={inputClass} placeholder="id finition / projet…" /></div>
          <div className="space-y-2"><Label className={labelClass}>ORDRE</Label>
            <Input type="number" value={form.display_order} onChange={(e) => set("display_order", e.target.value)} className={inputClass} /></div>
        </div>
        <label className="flex items-center gap-3 text-gray-300 cursor-pointer">
          <input type="checkbox" checked={form.is_active} onChange={(e) => set("is_active", e.target.checked)} className="w-5 h-5 accent-[oklch(0.78_0.28_145)]" />
          <span className="font-display tracking-wider text-sm">Active</span>
        </label>
        <Button type="submit" size="lg" disabled={saving}
          className="w-full font-display tracking-[0.2em] py-6 bg-primary hover:bg-primary/90 text-black border-4 border-primary disabled:opacity-50">
          {saving ? "ENREGISTREMENT…" : banner ? "METTRE À JOUR" : "CRÉER"}
        </Button>
      </form>
    </div>
  )
}
