"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { X } from "lucide-react"

interface QuoteFormModalProps {
  isOpen: boolean
  onClose: () => void
}

export function QuoteFormModal({ isOpen, onClose }: QuoteFormModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    carModel: "",
    serviceType: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      console.log("[v0] Submitting quote form:", formData)

      const response = await fetch("/api/quote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      console.log("[v0] Quote submission response:", data)

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit quote request")
      }

      alert("Quote request received! We'll contact you soon.")
      onClose()
      setFormData({
        name: "",
        email: "",
        phone: "",
        carModel: "",
        serviceType: "",
        message: "",
      })
    } catch (error) {
      console.error("[v0] Error submitting quote:", error)
      setSubmitError("Failed to submit. Please try contacting us directly via WhatsApp.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

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
            GET YOUR <span className="text-primary neon-text">QUOTE</span>
          </h2>
          <p className="text-gray-400 mt-2 text-sm md:text-base">Fill out the form and we'll get back to you ASAP</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white font-display text-lg tracking-wider">
                NAME *
              </Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-black/50 border-2 border-primary/30 focus:border-primary text-white placeholder:text-gray-600 h-12"
                placeholder="Your name"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white font-display text-lg tracking-wider">
                EMAIL *
              </Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-black/50 border-2 border-primary/30 focus:border-primary text-white placeholder:text-gray-600 h-12"
                placeholder="your@email.com"
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-white font-display text-lg tracking-wider">
                PHONE *
              </Label>
              <Input
                id="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="bg-black/50 border-2 border-primary/30 focus:border-primary text-white placeholder:text-gray-600 h-12"
                placeholder="+212 XXX XXX XXX"
              />
            </div>

            {/* Car Model */}
            <div className="space-y-2">
              <Label htmlFor="carModel" className="text-white font-display text-lg tracking-wider">
                CAR MODEL *
              </Label>
              <Input
                id="carModel"
                required
                value={formData.carModel}
                onChange={(e) => setFormData({ ...formData, carModel: e.target.value })}
                className="bg-black/50 border-2 border-primary/30 focus:border-primary text-white placeholder:text-gray-600 h-12"
                placeholder="e.g., Golf 8 GTD"
              />
            </div>
          </div>

          {/* Service Type */}
          <div className="space-y-2">
            <Label htmlFor="serviceType" className="text-white font-display text-lg tracking-wider">
              SERVICE TYPE *
            </Label>
            <select
              id="serviceType"
              required
              value={formData.serviceType}
              onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
              className="w-full bg-black/50 border-2 border-primary/30 focus:border-primary text-white h-12 px-4 rounded-md"
            >
              <option value="">Select a service</option>
              <option value="carbon-wrap">Carbon Fiber Wrapping</option>
              <option value="full-wrap">Full Wrap</option>
              <option value="performance-tuning">Performance Tuning</option>
              <option value="detailing">Detailing & Protection</option>
              <option value="custom-paint">Custom Paint Job</option>
              <option value="wheels">Wheel & Tire Services</option>
              <option value="interior">Interior Customization</option>
              <option value="led-ambient">LED Ambient Lighting</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message" className="text-white font-display text-lg tracking-wider">
              MESSAGE
            </Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="bg-black/50 border-2 border-primary/30 focus:border-primary text-white placeholder:text-gray-600 min-h-[120px] resize-none"
              placeholder="Tell us more about your project..."
            />
          </div>

          {submitError && (
            <div className="bg-red-500/10 border-2 border-red-500/50 text-red-400 p-4 rounded-md text-sm">
              {submitError}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="w-full font-display tracking-[0.2em] text-xl py-6 bg-primary hover:bg-primary/90 text-black border-4 border-primary transform hover:scale-105 transition-all shadow-[0_0_30px_rgba(var(--primary),0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isSubmitting ? "SUBMITTING..." : "SUBMIT QUOTE REQUEST"}
          </Button>
        </form>
      </div>
    </div>
  )
}
