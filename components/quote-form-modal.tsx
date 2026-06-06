"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { X } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { CAR_TYPE_OPTIONS, FINISH_OPTIONS, type QuoteRequestInsert } from "@/lib/supabase/types"
import { useLanguage } from "@/lib/i18n/language-context"

interface QuoteFormModalProps {
  isOpen: boolean
  onClose: () => void
}

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  carModel: "",
  carType: "",
  finish: "",
  color: "",
  message: "",
}

export function QuoteFormModal({ isOpen, onClose }: QuoteFormModalProps) {
  const { d } = useLanguage()
  const m = d.modal
  const [formData, setFormData] = useState(emptyForm)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      const payload: QuoteRequestInsert = {
        user_id: user?.id ?? null,
        contact_name: formData.name.trim(),
        contact_phone: formData.phone.trim(),
        contact_email: formData.email.trim() || null,
        car_model: formData.carModel.trim(),
        car_type: formData.carType as QuoteRequestInsert["car_type"],
        color_requested: formData.color.trim(),
        finish: formData.finish as QuoteRequestInsert["finish"],
        notes: formData.message.trim() || null,
      }

      const { error } = await supabase.from("quote_requests").insert(payload)
      if (error) throw error

      toast.success(m.success)
      onClose()
      setFormData(emptyForm)
    } catch (error) {
      console.error("[quote-modal] submit error:", error)
      toast.error(m.error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  const inputClass =
    "bg-black/50 border-2 border-primary/30 focus:border-primary text-white placeholder:text-gray-600 h-12"
  const selectClass = "w-full bg-black/50 border-2 border-primary/30 focus:border-primary text-white h-12 px-4 rounded-md"
  const labelClass = "text-white font-display text-lg tracking-wider"

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-gray-900 via-black to-gray-900 border-4 border-primary/50 shadow-[0_0_50px_rgba(var(--primary),0.3)] transform rotate-1 animate-in zoom-in-95 duration-300">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-primary transition-colors z-10 transform hover:rotate-90 duration-300"
        >
          <X size={32} strokeWidth={3} />
        </button>

        {/* Header */}
        <div className="bg-primary/10 border-b-4 border-primary/30 p-6 md:p-8">
          <h2 className="font-display text-4xl md:text-5xl text-white tracking-wider transform -rotate-1">
            {m.title1} <span className="text-primary neon-text">{m.title2}</span>
          </h2>
          <p className="text-gray-400 mt-2 text-sm md:text-base">{m.subtitle}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className={labelClass}>{m.name} *</Label>
              <Input id="name" required value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={inputClass} placeholder={m.namePh} />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className={labelClass}>{m.email}</Label>
              <Input id="email" type="email" value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={inputClass} placeholder="your@email.com" />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className={labelClass}>{m.phone} *</Label>
              <Input id="phone" type="tel" required value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={inputClass} placeholder="0649454288" />
            </div>

            {/* Car Model */}
            <div className="space-y-2">
              <Label htmlFor="carModel" className={labelClass}>{m.carModel} *</Label>
              <Input id="carModel" required value={formData.carModel}
                onChange={(e) => setFormData({ ...formData, carModel: e.target.value })}
                className={inputClass} placeholder={m.carModelPh} />
            </div>

            {/* Car Type */}
            <div className="space-y-2">
              <Label htmlFor="carType" className={labelClass}>{m.carType} *</Label>
              <select id="carType" required value={formData.carType}
                onChange={(e) => setFormData({ ...formData, carType: e.target.value })} className={selectClass}>
                <option value="">{m.select}</option>
                {CAR_TYPE_OPTIONS.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
              </select>
            </div>

            {/* Finish */}
            <div className="space-y-2">
              <Label htmlFor="finish" className={labelClass}>{m.finish} *</Label>
              <select id="finish" required value={formData.finish}
                onChange={(e) => setFormData({ ...formData, finish: e.target.value })} className={selectClass}>
                <option value="">{m.select}</option>
                {FINISH_OPTIONS.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
              </select>
            </div>
          </div>

          {/* Color */}
          <div className="space-y-2">
            <Label htmlFor="color" className={labelClass}>{m.color} *</Label>
            <Input id="color" required value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className={inputClass} placeholder={m.colorPh} />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message" className={labelClass}>{m.message}</Label>
            <Textarea id="message" value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="bg-black/50 border-2 border-primary/30 focus:border-primary text-white placeholder:text-gray-600 min-h-[120px] resize-none"
              placeholder={m.messagePh} />
          </div>

          {/* Submit Button */}
          <Button type="submit" size="lg" disabled={isSubmitting}
            className="w-full font-display tracking-[0.2em] text-xl py-6 bg-primary hover:bg-primary/90 text-black border-4 border-primary transform hover:scale-105 transition-all shadow-[0_0_30px_rgba(var(--primary),0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
            {isSubmitting ? m.submitting : m.submit}
          </Button>

          <p className="text-center text-sm text-gray-500">
            {m.photoHint}{" "}
            <Link href="/devis" onClick={onClose} className="text-primary hover:underline">
              {m.photoLink}
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
