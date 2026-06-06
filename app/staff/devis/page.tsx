"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { QUOTE_STATUS_OPTIONS, carTypeLabel, finishLabel, quoteStatus, type QuoteRow } from "@/lib/supabase/types"

export default function StaffDevis() {
  const [rows, setRows] = useState<QuoteRow[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    supabase
      .from("quote_requests")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) toast.error("Erreur de chargement.")
        else setRows((data as QuoteRow[]) ?? [])
        setLoading(false)
      })
  }, [])

  const update = async (id: string, status: string) => {
    const prev = rows
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, status } : r)))
    const { error } = await supabase.from("quote_requests").update({ status }).eq("id", id)
    if (error) { toast.error("Mise à jour échouée."); setRows(prev) }
    else toast.success("Statut mis à jour.")
  }

  const shown = filter === "all" ? rows : rows.filter((r) => r.status === filter)

  return (
    <div>
      <h2 className="font-display text-3xl text-white tracking-wider mb-6">DEVIS ({rows.length})</h2>

      <div className="flex flex-wrap gap-2 mb-6">
        {[{ value: "all", label: "Tout" }, ...QUOTE_STATUS_OPTIONS].map((s) => (
          <button key={s.value} onClick={() => setFilter(s.value)}
            className={`px-4 py-2 font-display tracking-widest text-xs border-2 transition-all ${
              filter === s.value ? "bg-primary text-black border-primary" : "bg-white/5 text-gray-300 border-white/20 hover:border-primary/50"
            }`}>
            {s.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 text-primary animate-spin" /></div>
      ) : shown.length === 0 ? (
        <Empty />
      ) : (
        <div className="overflow-x-auto border-4 border-primary/20 bg-black/40">
          <table className="w-full text-left text-sm">
            <thead className="bg-primary/10 text-primary font-display tracking-widest">
              <tr><Th>DATE</Th><Th>CLIENT</Th><Th>CONTACT</Th><Th>VOITURE</Th><Th>FINITION / COULEUR</Th><Th>NOTES</Th><Th>STATUT</Th></tr>
            </thead>
            <tbody>
              {shown.map((r) => {
                const st = quoteStatus(r.status)
                return (
                  <tr key={r.id} className="border-t border-white/10 hover:bg-white/5 align-top">
                    <Td className="text-gray-400 whitespace-nowrap">{new Date(r.created_at).toLocaleDateString("fr-FR")}</Td>
                    <Td className="text-white font-semibold">{r.contact_name}</Td>
                    <Td className="text-gray-300">
                      <a href={`tel:${r.contact_phone}`} className="hover:text-primary block">{r.contact_phone}</a>
                      <a href={`https://wa.me/${r.contact_phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer" className="text-green-400 text-xs hover:underline">WhatsApp</a>
                      {r.contact_email && <span className="block text-gray-500 text-xs break-all">{r.contact_email}</span>}
                    </Td>
                    <Td className="text-gray-300">{r.car_model}<br /><span className="text-gray-500 text-xs">{carTypeLabel(r.car_type)}</span></Td>
                    <Td className="text-gray-300">{finishLabel(r.finish)}<br /><span className="text-gray-500 text-xs">{r.color_requested}</span></Td>
                    <Td className="text-gray-400 max-w-[220px]">
                      {r.notes && <span className="block whitespace-pre-wrap break-words">{r.notes}</span>}
                      {r.photo_url && <a href={r.photo_url} target="_blank" rel="noopener noreferrer" className="text-primary text-xs hover:underline">📷 photo</a>}
                    </Td>
                    <Td>
                      <select value={r.status} onChange={(e) => update(r.id, e.target.value)}
                        className={`bg-black/60 border-2 text-xs font-display tracking-wider px-2 py-1.5 rounded outline-none cursor-pointer ${st?.cls ?? "border-white/30 text-white"}`}>
                        {QUOTE_STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value} className="bg-black text-white">{s.label}</option>)}
                      </select>
                    </Td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function Th({ children }: { children: React.ReactNode }) { return <th className="px-4 py-3 text-xs whitespace-nowrap">{children}</th> }
function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) { return <td className={`px-4 py-3 ${className}`}>{children}</td> }
function Empty() { return <div className="border-4 border-dashed border-primary/20 bg-black/30 py-20 text-center text-gray-500 font-display tracking-widest">AUCUN DEVIS</div> }
