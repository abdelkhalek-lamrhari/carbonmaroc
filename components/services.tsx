"use client"

import { Palette, Shield, Sparkles, Zap, Wrench, Droplet } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"

const serviceIcons = [Palette, Sparkles, Shield, Zap, Wrench, Droplet]

export function Services() {
  const { d } = useLanguage()
  const services = d.services.items.map((item, i) => ({ ...item, icon: serviceIcons[i] }))

  return (
    <section id="services" className="py-20 md:py-32 relative overflow-hidden slash-divider">
      <div className="absolute inset-0 stripe-bg" />

      <div className="absolute -top-32 -right-20 w-1/2 h-96 pointer-events-none hidden lg:block opacity-15 transform rotate-12">
        <img
          src="/images/design-mode/image-removebg-preview.png"
          alt=""
          className="w-full h-full object-contain"
        />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="mb-16 md:mb-24 space-y-6 md:space-y-8">
          <div className="inline-block transform -rotate-2 px-6 md:px-8 py-2 md:py-3 bg-primary/10 border-l-4 md:border-l-8 border-primary">
            <span className="font-display text-primary text-sm md:text-lg tracking-[0.3em]">{d.services.badge}</span>
          </div>
          <h2 className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] font-black tracking-tight leading-none">
            <span className="block text-white">{d.services.title1}</span>
            <span className="block text-primary neon-text -ml-2 md:-ml-4">{d.services.title2}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, index) => (
            <div key={index} className="group tilt-card p-8 md:p-10 cursor-pointer">
              <div className="space-y-4 md:space-y-6">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-primary blur-xl opacity-0 group-hover:opacity-50 transition-opacity" />
                  <service.icon className="w-16 h-16 md:w-20 md:h-20 text-primary relative z-10" strokeWidth={1.5} />
                </div>

                <h3 className="font-display text-3xl md:text-4xl tracking-[0.15em] text-white group-hover:text-primary transition-colors">
                  {service.title}
                </h3>

                <div className="w-24 h-1 bg-gradient-to-r from-primary to-transparent transform -rotate-3" />

                <p className="text-gray-400 text-base md:text-lg leading-relaxed">{service.description}</p>

                <div className="inline-block transform rotate-2 bg-secondary/20 border-2 border-secondary px-4 py-2 mt-4">
                  <span className="font-display text-secondary text-xs md:text-sm tracking-widest">{d.services.premium}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
