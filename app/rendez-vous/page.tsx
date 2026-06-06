"use client"

import type React from "react"
import { useState } from "react"
import { toast } from "sonner"
import { CheckCircle2 } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { supabase } from "@/lib/supabase/client"
import { useLanguage } from "@/lib/i18n/language-context"
import { SERVICE_OPTIONS, TIME_SLOT_OPTIONS, type BookingInsert } from "@/lib/supabase/types"

const inputClass =
  "bg-black/50 border-2 border-primary/30 focus:border-primary text-white placeholder:text-gray-600 h-12"
const labelClass = "text-white font-display text-lg tracking-wider"
const selectClass =
  "w-full bg-black/50 border-2 border-primary/30 focus:border-primary text-white h-12 px-4 rounded-md"

const emptyForm = {
  full_name: "",
  contact_phone: "",
  contact_email: "",
  service_id: "",
  appointment_date: "",
  appointment_time: "",
  notes: "",
}

export default function RendezVousPage() {
  const { d } = useLanguage()
  const b = d.bookingPage
  const [form, setForm] = useState(emptyForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const set = (key: keyof typeof emptyForm, value: string) => setForm((f) => ({ ...f, [key]: value }))

  const todayStr = new Date().toISOString().split("T")[0]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      // bookings has no name column → keep the name inside notes so staff still see it.
      const nameLine = `Nom : ${form.full_name.trim()}`
      const notes = form.notes.trim() ? `${nameLine}\n${form.notes.trim()}` : nameLine

      const payload: BookingInsert = {
        user_id: user?.id ?? null,
        service_id: form.service_id as BookingInsert["service_id"],
        appointment_date: form.appointment_date,
        appointment_time: form.appointment_time,
        contact_phone: form.contact_phone.trim(),
        contact_email: form.contact_email.trim() || null,
        notes,
      }

      const { error } = await supabase.from("bookings").insert(payload)
      if (error) throw error

      toast.success(b.toastSuccess)
      setForm(emptyForm)
      setDone(true)
    } catch (err) {
      console.error("[rendez-vous] submit error:", err)
      toast.error(b.toastError)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen gradient-bg">
      <SiteHeader />

      <section className="relative overflow-hidden pt-32 md:pt-40 pb-20 md:pb-32">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 blur-[100px] rounded-full" />
        <div className="absolute bottom-20 left-0 w-96 h-96 bg-accent/5 blur-[100px] rounded-full" />

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="mb-12 md:mb-16 space-y-6">
            <div className="inline-block transform -rotate-2 px-6 py-2 bg-secondary/10 border-l-4 md:border-l-8 border-secondary">
              <span className="font-display text-secondary text-sm md:text-lg tracking-[0.3em]">{b.badge}</span>
            </div>
            <h1 className="font-display text-5xl sm:text-7xl md:text-8xl font-black tracking-tight leading-none">
              <span className="block text-white transform rotate-1 inline-block">{b.title1}</span>{" "}
              <span className="text-primary neon-text transform -rotate-1 inline-block">{b.title2}</span>
            </h1>
            <p className="text-lg md:text-2xl text-gray-400 max-w-2xl">{b.intro}</p>
          </div>

          {done ? (
            <div className="max-w-2xl bg-gradient-to-br from-gray-900 via-black to-gray-900 border-4 border-primary/50 p-8 md:p-12 transform rotate-1 shadow-[0_0_50px_rgba(var(--primary),0.2)]">
              <CheckCircle2 className="w-16 h-16 text-primary mb-6" strokeWidth={2.5} />
              <h2 className="font-display text-4xl md:text-5xl text-white tracking-wider mb-4">{b.successTitle}</h2>
              <p className="text-gray-400 text-lg mb-8">{b.successBody}</p>
              <Button onClick={() => setDone(false)} size="lg"
                className="font-display tracking-[0.2em] text-lg py-6 px-8 bg-primary hover:bg-primary/90 text-black border-4 border-primary">
                {b.again}
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}
              className="max-w-3xl bg-gradient-to-br from-gray-900 via-black to-gray-900 border-4 border-primary/50 shadow-[0_0_50px_rgba(var(--primary),0.15)] p-6 md:p-10 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="full_name" className={labelClass}>{b.name} *</Label>
                  <Input id="full_name" required value={form.full_name}
                    onChange={(e) => set("full_name", e.target.value)} className={inputClass} placeholder={b.namePh} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_phone" className={labelClass}>{b.phone} *</Label>
                  <Input id="contact_phone" type="tel" required value={form.contact_phone}
                    onChange={(e) => set("contact_phone", e.target.value)} className={inputClass} placeholder="0649454288" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_email" className={labelClass}>{b.email}</Label>
                  <Input id="contact_email" type="email" value={form.contact_email}
                    onChange={(e) => set("contact_email", e.target.value)} className={inputClass} placeholder="email@email.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="service_id" className={labelClass}>{b.service} *</Label>
                  <select id="service_id" required value={form.service_id}
                    onChange={(e) => set("service_id", e.target.value)} className={selectClass}>
                    <option value="">{b.selectService}</option>
                    {SERVICE_OPTIONS.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="appointment_date" className={labelClass}>{b.date} *</Label>
                  <Input id="appointment_date" type="date" required min={todayStr} value={form.appointment_date}
                    onChange={(e) => set("appointment_date", e.target.value)}
                    className={`${inputClass} [color-scheme:dark]`} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="appointment_time" className={labelClass}>{b.slot} *</Label>
                  <select id="appointment_time" required value={form.appointment_time}
                    onChange={(e) => set("appointment_time", e.target.value)} className={selectClass}>
                    <option value="">{b.selectSlot}</option>
                    {TIME_SLOT_OPTIONS.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className={labelClass}>{b.notes}</Label>
                <Textarea id="notes" value={form.notes} onChange={(e) => set("notes", e.target.value)}
                  className="bg-black/50 border-2 border-primary/30 focus:border-primary text-white placeholder:text-gray-600 min-h-[120px] resize-none"
                  placeholder={b.notesPh} />
              </div>

              <Button type="submit" size="lg" disabled={isSubmitting}
                className="w-full font-display tracking-[0.2em] text-xl py-6 bg-primary hover:bg-primary/90 text-black border-4 border-primary transform hover:scale-[1.02] transition-all shadow-[0_0_30px_rgba(var(--primary),0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                {isSubmitting ? b.submitting : b.submit}
              </Button>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
