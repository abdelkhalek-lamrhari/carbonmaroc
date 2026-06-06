"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { Footer } from "@/components/footer"
import { supabase } from "@/lib/supabase/client"
import { CAR_TYPE_OPTIONS, FINISH_OPTIONS, carTypeLabel, finishLabel, type Project } from "@/lib/supabase/types"

const PROJECT_COLS = "id, title, car_model, car_type, finish, city, image_url, description"

export default function RealisationsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [carType, setCarType] = useState("all")
  const [finish, setFinish] = useState("all")

  useEffect(() => {
    supabase
      .from("projects")
      .select(PROJECT_COLS)
      .eq("is_published", true)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setProjects((data as Project[]) ?? [])
        setLoading(false)
      })
  }, [])

  const filtered = useMemo(
    () =>
      projects.filter(
        (p) => (carType === "all" || p.car_type === carType) && (finish === "all" || p.finish === finish),
      ),
    [projects, carType, finish],
  )

  return (
    <main className="min-h-screen gradient-bg">
      <SiteHeader />

      <section className="relative overflow-hidden pt-32 md:pt-40 pb-20 md:pb-32">
        <div className="absolute inset-0 stripe-bg" />
        <div className="absolute top-20 left-0 w-96 h-96 bg-primary/5 blur-[100px] rounded-full" />
        <div className="absolute bottom-20 right-0 w-96 h-96 bg-secondary/5 blur-[100px] rounded-full" />

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="mb-12 md:mb-16 space-y-6">
            <div className="inline-block transform -rotate-2 px-6 py-2 bg-secondary/10 border-l-4 md:border-l-8 border-secondary">
              <span className="font-display text-secondary text-sm md:text-lg tracking-[0.3em]">NOS RÉALISATIONS</span>
            </div>
            <h1 className="font-display text-5xl sm:text-7xl md:text-8xl font-black tracking-tight leading-none">
              <span className="block text-white transform -rotate-1 inline-block">GALERIE</span>
            </h1>
            <p className="text-lg md:text-2xl text-gray-400 max-w-2xl">Nos transformations, filtrées comme tu veux.</p>
          </div>

          {/* Filters */}
          <div className="space-y-4 mb-12">
            <FilterRow label="Type" active={carType} onPick={setCarType}
              options={[{ value: "all", label: "Tout" }, ...CAR_TYPE_OPTIONS]} />
            <FilterRow label="Finition" active={finish} onPick={setFinish}
              options={[{ value: "all", label: "Tout" }, ...FINISH_OPTIONS]} />
          </div>

          {loading ? (
            <div className="flex justify-center py-24"><Loader2 className="w-10 h-10 text-primary animate-spin" /></div>
          ) : filtered.length === 0 ? (
            <div className="border-4 border-dashed border-primary/20 bg-black/30 py-20 text-center text-gray-500 font-display tracking-widest">
              AUCUNE RÉALISATION POUR CE FILTRE
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filtered.map((p, index) => (
                <Link key={p.id} href={`/realisations/${p.id}`}
                  className={`group relative aspect-[4/3] overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-105 ${
                    index % 2 === 0 ? "md:-rotate-1 hover:rotate-0" : "md:rotate-1 hover:rotate-0"
                  }`}
                  style={{ clipPath: "polygon(2% 0, 100% 0, 98% 100%, 0 100%)" }}>
                  <div className="absolute inset-0 border-4 border-primary/0 group-hover:border-primary transition-all z-10" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image_url || "/placeholder.svg"} alt={p.title}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-70 group-hover:opacity-90 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="flex gap-2 mb-3">
                        <span className="inline-block px-3 py-1 bg-primary text-black font-display text-xs tracking-widest transform -rotate-2">
                          {finishLabel(p.finish)}
                        </span>
                        <span className="inline-block px-3 py-1 bg-white/10 text-white font-display text-xs tracking-widest">
                          {carTypeLabel(p.car_type)}
                        </span>
                      </div>
                      <h3 className="font-display text-2xl md:text-3xl text-white">{p.title}</h3>
                      <p className="text-gray-400 text-sm">{p.car_model} · {p.city}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}

function FilterRow({
  label, active, onPick, options,
}: { label: string; active: string; onPick: (v: string) => void; options: readonly { value: string; label: string }[] }) {
  return (
    <div className="flex flex-wrap items-center gap-2 md:gap-3">
      <span className="font-display text-gray-500 text-sm tracking-widest w-20">{label}</span>
      {options.map((o) => (
        <button key={o.value} onClick={() => onPick(o.value)}
          className={`px-4 py-2 font-display tracking-widest text-xs md:text-sm border-2 transition-all ${
            active === o.value
              ? "bg-primary text-black border-primary"
              : "bg-white/5 text-gray-300 border-white/20 hover:border-primary/50"
          }`}>
          {o.label}
        </button>
      ))}
    </div>
  )
}
