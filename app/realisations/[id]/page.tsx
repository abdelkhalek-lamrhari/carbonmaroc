"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import { Loader2, ArrowLeft } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase/client"
import { carTypeLabel, finishLabel, type Project } from "@/lib/supabase/types"

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from("projects")
      .select("id, title, car_model, car_type, finish, city, image_url, description, is_published, display_order, created_at")
      .eq("id", id)
      .maybeSingle()
      .then(({ data }) => {
        setProject((data as Project) ?? null)
        setLoading(false)
      })
  }, [id])

  return (
    <main className="min-h-screen gradient-bg">
      <SiteHeader />
      <section className="relative overflow-hidden pt-32 md:pt-40 pb-20 md:pb-32">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <Link href="/realisations" className="inline-flex items-center gap-2 text-gray-400 hover:text-primary font-display tracking-widest mb-8">
            <ArrowLeft size={20} /> RETOUR
          </Link>

          {loading ? (
            <div className="flex justify-center py-24"><Loader2 className="w-10 h-10 text-primary animate-spin" /></div>
          ) : !project ? (
            <div className="border-4 border-dashed border-primary/20 bg-black/30 py-20 text-center text-gray-500 font-display tracking-widest">
              RÉALISATION INTROUVABLE
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-start">
              <div className="relative border-4 border-primary/50 overflow-hidden shadow-[0_0_50px_rgba(var(--primary),0.2)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={project.image_url || "/placeholder.svg"} alt={project.title} className="w-full h-auto object-cover" />
              </div>
              <div className="space-y-6">
                <div className="flex flex-wrap gap-2">
                  <span className="px-4 py-2 bg-primary text-black font-display tracking-widest text-sm transform -rotate-2">
                    {finishLabel(project.finish)}
                  </span>
                  <span className="px-4 py-2 bg-white/10 text-white font-display tracking-widest text-sm">
                    {carTypeLabel(project.car_type)}
                  </span>
                </div>
                <h1 className="font-display text-4xl md:text-6xl text-white tracking-wider">{project.title}</h1>
                <p className="text-xl text-gray-300">{project.car_model} · {project.city}</p>
                {project.description && (
                  <p className="text-gray-400 leading-relaxed text-lg whitespace-pre-wrap">{project.description}</p>
                )}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link href="/devis">
                    <Button size="lg" className="w-full sm:w-auto font-display tracking-[0.2em] py-6 px-8 bg-primary hover:bg-primary/90 text-black border-4 border-primary">
                      JE VEUX LE MÊME
                    </Button>
                  </Link>
                  <Link href="/rendez-vous">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto font-display tracking-[0.2em] py-6 px-8 border-4 border-white/40 hover:border-secondary bg-transparent text-white">
                      PRENDRE RDV
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  )
}
