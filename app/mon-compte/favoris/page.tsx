"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { Loader2, Trash2, Sparkles } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "@/lib/supabase/auth-context"
import { finishLabel, type Favorite, type Project } from "@/lib/supabase/types"

type Enriched = Favorite & { project?: Pick<Project, "id" | "title" | "image_url" | "car_model"> | null }

export default function MesFavoris() {
  const { user } = useAuth()
  const [items, setItems] = useState<Enriched[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    ;(async () => {
      const { data } = await supabase
        .from("favorites")
        .select("id, item_type, item_id, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
      const favs = (data as Favorite[]) ?? []
      const projectIds = favs.filter((f) => f.item_type === "project").map((f) => f.item_id)
      let projectsById: Record<string, Project> = {}
      if (projectIds.length) {
        const { data: projs } = await supabase
          .from("projects")
          .select("id, title, image_url, car_model")
          .in("id", projectIds)
        projectsById = Object.fromEntries(((projs as Project[]) ?? []).map((p) => [p.id, p]))
      }
      setItems(favs.map((f) => ({ ...f, project: f.item_type === "project" ? projectsById[f.item_id] ?? null : null })))
      setLoading(false)
    })()
  }, [user])

  const remove = async (fav: Favorite) => {
    if (!user) return
    const prev = items
    setItems((xs) => xs.filter((x) => x.id !== fav.id))
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", user.id)
      .eq("item_type", fav.item_type)
      .eq("item_id", fav.item_id)
    if (error) {
      toast.error("Suppression échouée.")
      setItems(prev)
    } else toast.success("Retiré des favoris.")
  }

  if (loading) return <Loader2 className="w-8 h-8 text-primary animate-spin" />
  if (!items.length)
    return (
      <div className="border-4 border-dashed border-primary/20 bg-black/30 py-16 px-6 text-center text-gray-400">
        Aucun favori. Ajoute des finitions ou des réalisations depuis l'app ou la{" "}
        <Link href="/realisations" className="text-primary hover:underline">galerie</Link>.
      </div>
    )

  return (
    <div className="grid sm:grid-cols-2 gap-5">
      {items.map((f) => (
        <div key={f.id} className="relative bg-white/5 border-2 border-white/10 overflow-hidden group">
          <button onClick={() => remove(f)} aria-label="Retirer"
            className="absolute top-2 right-2 z-10 p-2 bg-black/60 text-gray-300 hover:text-red-400 border border-white/20">
            <Trash2 className="w-4 h-4" />
          </button>
          {f.item_type === "project" && f.project ? (
            <Link href={`/realisations/${f.project.id}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={f.project.image_url || "/placeholder.svg"} alt={f.project.title} className="w-full h-40 object-cover" />
              <div className="p-4">
                <div className="font-display text-lg text-white">{f.project.title}</div>
                <div className="text-gray-400 text-sm">{f.project.car_model}</div>
              </div>
            </Link>
          ) : f.item_type === "finish" ? (
            <div className="p-6 flex items-center gap-4 h-full">
              <div className="w-14 h-14 bg-primary/15 border-2 border-primary/40 flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-primary" />
              </div>
              <div>
                <div className="text-gray-500 text-xs font-display tracking-widest">FINITION</div>
                <div className="font-display text-2xl text-white">{finishLabel(f.item_id)}</div>
              </div>
            </div>
          ) : (
            <div className="p-6 text-gray-400">{f.item_type} · {f.item_id}</div>
          )}
        </div>
      ))}
    </div>
  )
}
