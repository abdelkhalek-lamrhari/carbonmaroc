"use client"

import type React from "react"
import { useState } from "react"
import { toast } from "sonner"
import { Upload, X, CheckCircle2 } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { supabase } from "@/lib/supabase/client"
import { useLanguage } from "@/lib/i18n/language-context"
import {
  CAR_TYPE_OPTIONS,
  FINISH_OPTIONS,
  QUOTE_PHOTOS_BUCKET,
  type QuoteRequestInsert,
} from "@/lib/supabase/types"

const inputClass =
  "bg-black/50 border-2 border-primary/30 focus:border-primary text-white placeholder:text-gray-600 h-12"
const labelClass = "text-white font-display text-lg tracking-wider"
const selectClass =
  "w-full bg-black/50 border-2 border-primary/30 focus:border-primary text-white h-12 px-4 rounded-md"

const emptyForm = {
  contact_name: "",
  contact_phone: "",
  contact_email: "",
  car_model: "",
  car_type: "",
  color_requested: "",
  finish: "",
  notes: "",
}

export default function DevisPage() {
  const { d } = useLanguage()
  const q = d.quotePage
  const [form, setForm] = useState(emptyForm)
  const [photo, setPhoto] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const set = (key: keyof typeof emptyForm, value: string) => setForm((f) => ({ ...f, [key]: value }))

  const onPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    if (file && file.size > 8 * 1024 * 1024) {
      toast.error(q.toastPhotoBig)
      return
    }
    setPhoto(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      // Optional single photo upload to the public `quotes` bucket.
      let photo_url: string | null = null
      if (photo) {
        const ownerKey = user?.id ?? crypto.randomUUID()
        const safeName = photo.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")
        const path = `${ownerKey}/${Date.now()}-${safeName}`
        const { error: uploadError } = await supabase.storage
          .from(QUOTE_PHOTOS_BUCKET)
          .upload(path, photo, { cacheControl: "3600", upsert: false })

        if (uploadError) {
          console.error("[devis] upload error:", uploadError.message)
          toast.warning(q.toastPhoto)
        } else {
          photo_url = supabase.storage.from(QUOTE_PHOTOS_BUCKET).getPublicUrl(path).data.publicUrl
        }
      }

      const payload: QuoteRequestInsert = {
        user_id: user?.id ?? null,
        contact_name: form.contact_name.trim(),
        contact_phone: form.contact_phone.trim(),
        contact_email: form.contact_email.trim() || null,
        car_model: form.car_model.trim(),
        car_type: form.car_type as QuoteRequestInsert["car_type"],
        color_requested: form.color_requested.trim(),
        finish: form.finish as QuoteRequestInsert["finish"],
        notes: form.notes.trim() || null,
        photo_url,
      }

      const { error } = await supabase.from("quote_requests").insert(payload)
      if (error) throw error

      toast.success(q.toastSuccess)
      setForm(emptyForm)
      setPhoto(null)
      setDone(true)
    } catch (err) {
      console.error("[devis] submit error:", err)
      toast.error(q.toastError)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen gradient-bg">
      <SiteHeader />

      <section className="relative overflow-hidden pt-32 md:pt-40 pb-20 md:pb-32">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="absolute top-20 left-0 w-96 h-96 bg-primary/5 blur-[100px] rounded-full" />
        <div className="absolute bottom-20 right-0 w-96 h-96 bg-secondary/5 blur-[100px] rounded-full" />

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="mb-12 md:mb-16 space-y-6">
            <div className="inline-block transform rotate-2 px-6 py-2 bg-primary/10 border-r-4 md:border-r-8 border-primary">
              <span className="font-display text-primary text-sm md:text-lg tracking-[0.3em]">{q.badge}</span>
            </div>
            <h1 className="font-display text-5xl sm:text-7xl md:text-8xl font-black tracking-tight leading-none">
              <span className="block text-white transform -rotate-1 inline-block">{q.title1}</span>{" "}
              <span className="text-primary neon-text transform rotate-1 inline-block">{q.title2}</span>
            </h1>
            <p className="text-lg md:text-2xl text-gray-400 max-w-2xl">{q.intro}</p>
          </div>

          {done ? (
            <div className="max-w-2xl bg-gradient-to-br from-gray-900 via-black to-gray-900 border-4 border-primary/50 p-8 md:p-12 transform -rotate-1 shadow-[0_0_50px_rgba(var(--primary),0.2)]">
              <CheckCircle2 className="w-16 h-16 text-primary mb-6" strokeWidth={2.5} />
              <h2 className="font-display text-4xl md:text-5xl text-white tracking-wider mb-4">{q.successTitle}</h2>
              <p className="text-gray-400 text-lg mb-8">{q.successBody}</p>
              <Button
                onClick={() => setDone(false)}
                size="lg"
                className="font-display tracking-[0.2em] text-lg py-6 px-8 bg-primary hover:bg-primary/90 text-black border-4 border-primary"
              >
                {q.again}
              </Button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="max-w-3xl bg-gradient-to-br from-gray-900 via-black to-gray-900 border-4 border-primary/50 shadow-[0_0_50px_rgba(var(--primary),0.15)] p-6 md:p-10 space-y-6"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="contact_name" className={labelClass}>{q.name} *</Label>
                  <Input id="contact_name" required value={form.contact_name}
                    onChange={(e) => set("contact_name", e.target.value)} className={inputClass} placeholder={q.namePh} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_phone" className={labelClass}>{q.phone} *</Label>
                  <Input id="contact_phone" type="tel" required value={form.contact_phone}
                    onChange={(e) => set("contact_phone", e.target.value)} className={inputClass} placeholder="0649454288" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_email" className={labelClass}>{q.email}</Label>
                  <Input id="contact_email" type="email" value={form.contact_email}
                    onChange={(e) => set("contact_email", e.target.value)} className={inputClass} placeholder="email@email.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="car_model" className={labelClass}>{q.car} *</Label>
                  <Input id="car_model" required value={form.car_model}
                    onChange={(e) => set("car_model", e.target.value)} className={inputClass} placeholder={q.carPh} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="car_type" className={labelClass}>{q.carType} *</Label>
                  <select id="car_type" required value={form.car_type}
                    onChange={(e) => set("car_type", e.target.value)} className={selectClass}>
                    <option value="">{q.select}</option>
                    {CAR_TYPE_OPTIONS.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="finish" className={labelClass}>{q.finish} *</Label>
                  <select id="finish" required value={form.finish}
                    onChange={(e) => set("finish", e.target.value)} className={selectClass}>
                    <option value="">{q.select}</option>
                    {FINISH_OPTIONS.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="color_requested" className={labelClass}>{q.color} *</Label>
                <Input id="color_requested" required value={form.color_requested}
                  onChange={(e) => set("color_requested", e.target.value)} className={inputClass}
                  placeholder={q.colorPh} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className={labelClass}>{q.message}</Label>
                <Textarea id="notes" value={form.notes} onChange={(e) => set("notes", e.target.value)}
                  className="bg-black/50 border-2 border-primary/30 focus:border-primary text-white placeholder:text-gray-600 min-h-[120px] resize-none"
                  placeholder={q.messagePh} />
              </div>

              <div className="space-y-2">
                <Label className={labelClass}>{q.photo}</Label>
                {photo ? (
                  <div className="flex items-center justify-between gap-4 bg-black/50 border-2 border-primary/30 p-4">
                    <span className="text-gray-300 truncate text-sm">{photo.name}</span>
                    <button type="button" onClick={() => setPhoto(null)}
                      className="text-gray-400 hover:text-primary transition-colors flex-shrink-0">
                      <X size={22} strokeWidth={3} />
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center gap-3 cursor-pointer bg-black/50 border-2 border-dashed border-primary/30 hover:border-primary p-4 transition-colors text-gray-400 hover:text-primary">
                    <Upload size={22} />
                    <span className="text-sm">{q.photoAdd}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={onPhotoChange} />
                  </label>
                )}
              </div>

              <Button type="submit" size="lg" disabled={isSubmitting}
                className="w-full font-display tracking-[0.2em] text-xl py-6 bg-primary hover:bg-primary/90 text-black border-4 border-primary transform hover:scale-[1.02] transition-all shadow-[0_0_30px_rgba(var(--primary),0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                {isSubmitting ? q.submitting : q.submit}
              </Button>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
