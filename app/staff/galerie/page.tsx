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
import { CAR_TYPE_OPTIONS, FINISH_OPTIONS, PROJECTS_BUCKET, carTypeLabel, finishLabel } from "@/lib/supabase/types"

interface ProjectFull {
  id: string
  title: string
  car_model: string
  car_type: string
  finish: string
  city: string | null
  image_url: string | null
  description: string | null
  is_published: boolean
  display_order: number
}

const emptyForm = {
  title: "", car_model: "", car_type: "berline", finish: "mat", city: "Casablanca",
  description: "", display_order: "0", is_published: true,
}

const inputClass = "bg-black/50 border-2 border-primary/30 focus:border-primary text-white h-11"
const selectClass = "w-full bg-black/50 border-2 border-primary/30 text-white h-11 px-3 rounded-md"
const labelClass = "text-white font-display text-sm tracking-wider"

export default function StaffGalerie() {
  const [rows, setRows] = useState<ProjectFull[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<ProjectFull | null>(null)
  const [showForm, setShowForm] = useState(false)

  const load = () =>
    supabase
      .from("projects")
      .select("id, title, car_model, car_type, finish, city, image_url, description, is_published, display_order")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setRows((data as ProjectFull[]) ?? [])
        setLoading(false)
      })

  useEffect(() => { load() }, [])

  const togglePublish = async (p: ProjectFull) => {
    const prev = rows
    setRows((rs) => rs.map((r) => (r.id === p.id ? { ...r, is_published: !r.is_published } : r)))
    const { error } = await supabase.from("projects").update({ is_published: !p.is_published }).eq("id", p.id)
    if (error) { toast.error("Échec."); setRows(prev) }
  }

  const remove = async (p: ProjectFull) => {
    if (!confirm(`Supprimer "${p.title}" ?`)) return
    const { error } = await supabase.from("projects").delete().eq("id", p.id)
    if (error) toast.error("Suppression échouée.")
    else { toast.success("Projet supprimé."); setRows((rs) => rs.filter((r) => r.id !== p.id)) }
  }

  const openNew = () => { setEditing(null); setShowForm(true) }
  const openEdit = (p: ProjectFull) => { setEditing(p); setShowForm(true) }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-4">
        <h2 className="font-display text-3xl text-white tracking-wider">GALERIE ({rows.length})</h2>
        <Button onClick={openNew} className="font-display tracking-widest bg-primary hover:bg-primary/90 text-black border-2 border-primary">
          <Plus className="w-4 h-4 mr-1" /> NOUVEAU
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 text-primary animate-spin" /></div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {rows.map((p) => (
            <div key={p.id} className="bg-white/5 border-2 border-white/10 overflow-hidden">
              <div className="relative h-40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image_url || "/placeholder.svg"} alt={p.title} className="w-full h-full object-cover" />
                {!p.is_published && (
                  <span className="absolute top-2 left-2 px-2 py-1 bg-black/80 text-gray-300 text-xs font-display tracking-widest">BROUILLON</span>
                )}
                <span className="absolute top-2 right-2 px-2 py-1 bg-black/70 text-primary text-xs font-display">#{p.display_order}</span>
              </div>
              <div className="p-4 space-y-2">
                <div className="font-display text-lg text-white">{p.title}</div>
                <div className="text-gray-400 text-sm">{p.car_model} · {carTypeLabel(p.car_type)} · {finishLabel(p.finish)}</div>
                <div className="flex gap-2 pt-2">
                  <button onClick={() => togglePublish(p)} className="flex-1 flex items-center justify-center gap-1 py-2 border-2 border-white/15 text-gray-300 hover:border-primary hover:text-primary text-xs font-display tracking-widest">
                    {p.is_published ? <><EyeOff className="w-4 h-4" /> Cacher</> : <><Eye className="w-4 h-4" /> Publier</>}
                  </button>
                  <button onClick={() => openEdit(p)} className="p-2 border-2 border-white/15 text-gray-300 hover:border-primary hover:text-primary"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => remove(p)} className="p-2 border-2 border-white/15 text-gray-300 hover:border-red-500 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <ProjectForm
          project={editing}
          nextOrder={rows.length ? Math.max(...rows.map((r) => r.display_order)) + 1 : 0}
          onClose={() => setShowForm(false)}
          onSaved={() => { setShowForm(false); load() }}
        />
      )}
    </div>
  )
}

function ProjectForm({
  project, nextOrder, onClose, onSaved,
}: { project: ProjectFull | null; nextOrder: number; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState(
    project
      ? { title: project.title, car_model: project.car_model, car_type: project.car_type, finish: project.finish,
          city: project.city ?? "Casablanca", description: project.description ?? "",
          display_order: String(project.display_order), is_published: project.is_published }
      : { ...emptyForm, display_order: String(nextOrder) },
  )
  const [file, setFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const set = (k: keyof typeof form, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      let imageUrl = project?.image_url ?? null
      if (file) {
        const ext = file.name.split(".").pop()?.toLowerCase() || "jpg"
        const path = `${crypto.randomUUID()}/${Date.now()}.${ext}`
        const { error: upErr } = await supabase.storage.from(PROJECTS_BUCKET).upload(path, file, {
          contentType: file.type || "image/jpeg", upsert: false,
        })
        if (upErr) throw upErr
        imageUrl = supabase.storage.from(PROJECTS_BUCKET).getPublicUrl(path).data.publicUrl
      }
      const payload = {
        title: form.title.trim(), car_model: form.car_model.trim(), car_type: form.car_type, finish: form.finish,
        city: form.city.trim() || null, description: form.description.trim() || null,
        image_url: imageUrl, display_order: Number(form.display_order) || 0, is_published: form.is_published,
      }
      if (project) {
        const { error } = await supabase.from("projects").update(payload).eq("id", project.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from("projects").insert(payload)
        if (error) throw error
      }
      toast.success(project ? "Projet mis à jour." : "Projet créé.")
      onSaved()
    } catch (err) {
      toast.error("Échec : " + (err instanceof Error ? err.message : "erreur"))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />
      <form onSubmit={submit}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-gray-900 via-black to-gray-900 border-4 border-primary/50 p-6 md:p-8 space-y-5">
        <button type="button" onClick={onClose} className="absolute top-4 right-4 text-white hover:text-primary"><X size={28} strokeWidth={3} /></button>
        <h3 className="font-display text-3xl text-white tracking-wider">{project ? "MODIFIER" : "NOUVEAU"} <span className="text-primary">PROJET</span></h3>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2"><Label className={labelClass}>TITRE *</Label>
            <Input required value={form.title} onChange={(e) => set("title", e.target.value)} className={inputClass} /></div>
          <div className="space-y-2"><Label className={labelClass}>MODÈLE *</Label>
            <Input required value={form.car_model} onChange={(e) => set("car_model", e.target.value)} className={inputClass} placeholder="Audi RS3" /></div>
          <div className="space-y-2"><Label className={labelClass}>TYPE *</Label>
            <select value={form.car_type} onChange={(e) => set("car_type", e.target.value)} className={selectClass}>
              {CAR_TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select></div>
          <div className="space-y-2"><Label className={labelClass}>FINITION *</Label>
            <select value={form.finish} onChange={(e) => set("finish", e.target.value)} className={selectClass}>
              {FINISH_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select></div>
          <div className="space-y-2"><Label className={labelClass}>VILLE</Label>
            <Input value={form.city} onChange={(e) => set("city", e.target.value)} className={inputClass} /></div>
          <div className="space-y-2"><Label className={labelClass}>ORDRE D'AFFICHAGE</Label>
            <Input type="number" value={form.display_order} onChange={(e) => set("display_order", e.target.value)} className={inputClass} /></div>
        </div>

        <div className="space-y-2"><Label className={labelClass}>DESCRIPTION</Label>
          <Textarea value={form.description} onChange={(e) => set("description", e.target.value)}
            className="bg-black/50 border-2 border-primary/30 text-white min-h-[90px] resize-none" /></div>

        <div className="space-y-2">
          <Label className={labelClass}>IMAGE {project ? "(laisser vide pour garder l'actuelle)" : "*"}</Label>
          <input type="file" accept="image/*" required={!project} onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-primary file:text-black file:font-display file:tracking-widest" />
        </div>

        <label className="flex items-center gap-3 text-gray-300 cursor-pointer">
          <input type="checkbox" checked={form.is_published} onChange={(e) => set("is_published", e.target.checked)} className="w-5 h-5 accent-[oklch(0.78_0.28_145)]" />
          <span className="font-display tracking-wider text-sm">Publié</span>
        </label>

        <Button type="submit" size="lg" disabled={saving}
          className="w-full font-display tracking-[0.2em] py-6 bg-primary hover:bg-primary/90 text-black border-4 border-primary disabled:opacity-50">
          {saving ? "ENREGISTREMENT…" : project ? "METTRE À JOUR" : "CRÉER LE PROJET"}
        </Button>
      </form>
    </div>
  )
}
