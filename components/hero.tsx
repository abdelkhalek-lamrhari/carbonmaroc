"use client"

import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import { useEffect, useState } from "react"

export function Hero() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden gradient-bg">
      <div className="absolute inset-0 grid-pattern" />

      <div
        className="absolute -right-20 md:right-0 top-0 w-full md:w-[70%] h-full z-0 opacity-20 md:opacity-30"
        style={{ transform: `translateY(${scrollY * 0.3}px) rotate(-5deg)` }}
      >
        <img
          src="/images/design-mode/carbonmaroc.jpg"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      <div className="absolute -bottom-5 -right-5 md:-bottom-10 md:-right-10 w-[80%] sm:w-[60%] md:w-[50%] lg:w-[45%] h-[40%] sm:h-[50%] md:h-[60%] z-20 offset-image">
        <img
          src="/images/design-mode/ChatGPT%20Image%20Oct%2011%2C%202025%2C%2008_29_53%20PM.png"
          alt="Featured Car"
          className="w-full h-full object-contain object-bottom"
          style={{ transform: `translateX(${scrollY * 0.1}px)` }}
        />
      </div>

      <div className="absolute top-32 right-12 z-30 sticker bg-secondary px-6 py-3 hidden lg:block">
        <span className="font-display text-black text-2xl">CASA BLANCA</span>
      </div>

      <div className="relative z-10 container mx-auto px-4 lg:px-8 pt-32 pb-20">
        <div className="max-w-4xl space-y-10">
          <div className="space-y-4">
            <h1 className="font-display text-[3.5rem] sm:text-[5rem] md:text-[8rem] lg:text-[12rem] font-black leading-[0.85] tracking-tight">
              <span className="block text-white text-reveal" style={{ animationDelay: "0.1s" }}>
                CARBON
              </span>
              <span className="block text-primary neon-text text-reveal" style={{ animationDelay: "0.3s" }}>
                MAROC
              </span>
            </h1>

            <div className="inline-block transform -rotate-2 bg-primary/20 border-l-4 border-primary px-4 py-3 md:px-6 md:py-4 backdrop-blur-sm ml-2 md:ml-4">
              <p className="text-base sm:text-xl md:text-2xl text-white font-bold tracking-wide">
                PRECISION × PASSION × POWER
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <Button
              size="lg"
              className="w-full sm:w-auto text-lg md:text-xl px-8 md:px-12 py-6 md:py-8 font-display tracking-[0.2em] bg-primary hover:bg-primary/90 text-black border-4 border-primary aggressive-pulse transform hover:scale-105 transition-transform"
            >
              BOOK NOW
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto text-lg md:text-xl px-8 md:px-12 py-6 md:py-8 font-display tracking-[0.2em] border-4 border-white/40 hover:border-secondary hover:bg-secondary/20 transition-all bg-transparent transform hover:-rotate-1"
            >
              GALLERY
            </Button>
          </div>

          <div className="flex flex-wrap gap-6 md:gap-8 pt-8">
            <div className="transform rotate-2">
              <div className="text-4xl md:text-5xl font-display text-primary neon-text">500+</div>
              <div className="text-xs md:text-sm text-gray-400 uppercase tracking-widest">Projects</div>
            </div>
            <div className="transform -rotate-1">
              <div className="text-4xl md:text-5xl font-display text-secondary neon-text">10+</div>
              <div className="text-xs md:text-sm text-gray-400 uppercase tracking-widest">Years</div>
            </div>
            <div className="transform rotate-1">
              <div className="text-4xl md:text-5xl font-display text-accent neon-text">100%</div>
              <div className="text-xs md:text-sm text-gray-400 uppercase tracking-widest">Quality</div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce glitch">
        <ChevronDown className="w-10 h-10 text-primary" strokeWidth={3} />
      </div>
    </section>
  )
}
