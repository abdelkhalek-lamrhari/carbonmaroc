"use client"

import { useLanguage } from "@/lib/i18n/language-context"

export function About() {
  const { d } = useLanguage()
  return (
    <section id="about" className="py-20 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20" />

      <div className="absolute -bottom-20 -left-20 w-full md:w-2/3 h-[500px] pointer-events-none hidden lg:block opacity-20 transform -rotate-12">
        <img
          src="/images/design-mode/showcase-about.png"
          alt=""
          className="w-full h-full object-contain"
        />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-16 md:space-y-20">
            <div className="space-y-6 md:space-y-8">
              <div className="inline-block transform -rotate-2 px-6 md:px-8 py-2 md:py-3 bg-accent/10 border-t-4 md:border-t-8 border-accent">
                <span className="font-display text-accent text-sm md:text-lg tracking-[0.3em]">{d.about.badge}</span>
              </div>
              <h2 className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] font-black tracking-tight leading-none">
                <span className="block text-white transform rotate-1 inline-block">{d.about.title1}</span>
                <span className="block text-accent neon-text -ml-4 md:-ml-8">{d.about.title2}</span>
              </h2>
            </div>

            <div className="space-y-8 md:space-y-12">
              <div className="transform -rotate-1 bg-white/5 border-l-4 md:border-l-8 border-primary p-6 md:p-10 backdrop-blur-sm">
                <p className="text-2xl md:text-3xl lg:text-4xl text-white leading-relaxed font-light">
                  {d.about.leadPre}
                  <span className="text-primary font-bold neon-text">{d.about.leadHighlight}</span>.
                </p>
              </div>

              <div className="transform rotate-1 bg-white/5 border-r-4 md:border-r-8 border-secondary p-6 md:p-10 backdrop-blur-sm ml-auto max-w-4xl">
                <p className="text-lg md:text-xl text-gray-300 leading-relaxed">{d.about.para2}</p>
              </div>

              <div className="transform -rotate-1 bg-white/5 border-l-4 md:border-l-8 border-accent p-6 md:p-10 backdrop-blur-sm max-w-4xl">
                <p className="text-lg md:text-xl text-gray-300 leading-relaxed">{d.about.para3}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 pt-8 md:pt-12">
              <div className="sticker bg-primary/10 border-4 border-primary p-8 md:p-10 backdrop-blur-sm">
                <div className="font-display text-6xl md:text-8xl text-primary neon-text">500+</div>
                <div className="font-display text-base md:text-lg text-white tracking-[0.2em] mt-3 md:mt-4">
                  {d.about.statCars}
                </div>
              </div>
              <div className="sticker bg-secondary/10 border-4 border-secondary p-8 md:p-10 backdrop-blur-sm">
                <div className="font-display text-6xl md:text-8xl text-secondary neon-text">10+</div>
                <div className="font-display text-base md:text-lg text-white tracking-[0.2em] mt-3 md:mt-4">
                  {d.about.statYears}
                </div>
              </div>
              <div className="sticker bg-accent/10 border-4 border-accent p-8 md:p-10 backdrop-blur-sm sm:col-span-2 lg:col-span-1">
                <div className="font-display text-6xl md:text-8xl text-accent neon-text">100%</div>
                <div className="font-display text-base md:text-lg text-white tracking-[0.2em] mt-3 md:mt-4">
                  {d.about.statSatisfaction}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
