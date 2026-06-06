// Types + option lists mirroring the REAL Supabase schema (verified against the live DB).
// Do NOT add columns that don't exist in the database — inserts will fail on NOT NULL / CHECK.

/* ----------------------------- Enums / options ---------------------------- */

// quote_requests.finish + projects.finish CHECK
export const FINISH_OPTIONS = [
  { value: "mat", label: "Mat" },
  { value: "brillant", label: "Brillant" },
  { value: "satin", label: "Satin" },
  { value: "metallise", label: "Métallisé" },
  { value: "chrome", label: "Chromé" },
  { value: "carbone", label: "Carbone" },
] as const
export type Finish = (typeof FINISH_OPTIONS)[number]["value"]

// quote_requests.car_type + projects.car_type CHECK
export const CAR_TYPE_OPTIONS = [
  { value: "compacte", label: "Compacte" },
  { value: "berline", label: "Berline" },
  { value: "coupe", label: "Coupé" },
  { value: "suv", label: "SUV" },
  { value: "sportive", label: "Sportive" },
] as const
export type CarType = (typeof CAR_TYPE_OPTIONS)[number]["value"]

// bookings.service_id CHECK — labels per the official Carbon Maroc spec.
export const SERVICE_OPTIONS = [
  { value: "wrap-full", label: "Wrap intégral" },
  { value: "wrap-partial", label: "Wrap partiel" },
  { value: "inspection", label: "Inspection" },
  { value: "polish", label: "Polish & lustrage" },
  { value: "removal", label: "Retrait de wrap" },
  { value: "ppf", label: "Film PPF" },
  { value: "ambient-light", label: "Éclairage d'ambiance" },
  { value: "steering-wheel", label: "Volant sur mesure" },
  { value: "wheel-painting", label: "Peinture de jantes" },
  { value: "seat-change", label: "Changement de sellerie" },
] as const
export type ServiceId = (typeof SERVICE_OPTIONS)[number]["value"]
export const serviceLabel = (v: string) => SERVICE_OPTIONS.find((o) => o.value === v)?.label ?? v

// appointment_time is text 'HH:MM' — hourly slots 09:00 → 18:00 (matches the mobile app).
export const TIME_SLOT_OPTIONS = Array.from({ length: 10 }, (_, i) => {
  const h = String(9 + i).padStart(2, "0") + ":00"
  return { value: h, label: h }
})

// quote_requests.status CHECK = new|contacted|quoted|won|lost (NOT 'closed' — the brief was wrong).
export type QuoteStatus = "new" | "contacted" | "quoted" | "won" | "lost"
export const QUOTE_STATUS_OPTIONS: { value: QuoteStatus; label: string; cls: string }[] = [
  { value: "new", label: "Nouveau", cls: "bg-primary/20 text-primary border-primary/50" },
  { value: "contacted", label: "Contacté", cls: "bg-blue-500/20 text-blue-300 border-blue-500/50" },
  { value: "quoted", label: "Devis envoyé", cls: "bg-yellow-500/20 text-yellow-300 border-yellow-500/50" },
  { value: "won", label: "Gagné", cls: "bg-green-500/20 text-green-300 border-green-500/50" },
  { value: "lost", label: "Perdu", cls: "bg-red-500/20 text-red-300 border-red-500/50" },
]

export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled"
export const BOOKING_STATUS_OPTIONS: { value: BookingStatus; label: string; cls: string }[] = [
  { value: "pending", label: "En attente", cls: "bg-yellow-500/20 text-yellow-300 border-yellow-500/50" },
  { value: "confirmed", label: "Confirmé", cls: "bg-blue-500/20 text-blue-300 border-blue-500/50" },
  { value: "completed", label: "Terminé", cls: "bg-green-500/20 text-green-300 border-green-500/50" },
  { value: "cancelled", label: "Annulé", cls: "bg-red-500/20 text-red-300 border-red-500/50" },
]
export const quoteStatus = (v: string) => QUOTE_STATUS_OPTIONS.find((s) => s.value === v)
export const bookingStatus = (v: string) => BOOKING_STATUS_OPTIONS.find((s) => s.value === v)

// promo_banners.link_type CHECK (real values).
export const LINK_TYPE_OPTIONS = [
  { value: "none", label: "Aucun" },
  { value: "finish", label: "Finition" },
  { value: "service", label: "Service" },
  { value: "project", label: "Projet" },
  { value: "gallery", label: "Galerie" },
  { value: "customizer", label: "Customizer" },
] as const

/* ------------------------------- Row shapes ------------------------------- */

export interface QuoteRequestInsert {
  user_id?: string | null
  contact_name: string
  contact_phone: string
  contact_email?: string | null
  car_model: string
  car_type: CarType
  color_requested: string
  finish: Finish
  notes?: string | null
  photo_url?: string | null
  // status defaults to 'new' in the DB
}

export interface BookingInsert {
  user_id?: string | null
  service_id: ServiceId
  appointment_date: string // YYYY-MM-DD
  appointment_time: string
  contact_phone: string
  contact_email?: string | null
  notes?: string | null
  // status defaults to 'pending' in the DB
}

export interface Project {
  id: string
  title: string
  car_model: string
  car_type: CarType
  finish: Finish
  city: string | null
  image_url: string | null
  description: string | null
  is_published: boolean
  display_order: number
  created_at: string
}

export const finishLabel = (v: string) => FINISH_OPTIONS.find((o) => o.value === v)?.label ?? v
export const carTypeLabel = (v: string) => CAR_TYPE_OPTIONS.find((o) => o.value === v)?.label ?? v

export interface Profile {
  id: string
  full_name: string | null
  phone: string | null
  city: string | null
  is_staff: boolean
}

export interface QuoteRow {
  id: string
  user_id: string | null
  contact_name: string
  contact_phone: string
  contact_email: string | null
  car_model: string
  car_type: string
  color_requested: string
  finish: string
  notes: string | null
  photo_url: string | null
  status: string
  created_at: string
}

export interface BookingRow {
  id: string
  user_id: string | null
  service_id: string
  appointment_date: string
  appointment_time: string
  contact_phone: string
  contact_email: string | null
  notes: string | null
  status: string
  created_at: string
}

export interface Favorite {
  id: string
  item_type: "finish" | "project"
  item_id: string
  created_at: string
}

export interface SavedConfiguration {
  id: string
  name: string | null
  car_name: string
  car_type: string
  color_label: string
  color_value: string
  finish_label: string
  finish_id: string
  created_at: string
}

export interface PromoBanner {
  id: string
  badge: string | null
  title: string
  body: string | null
  cta_label: string | null
  link_type: string | null
  link_target: string | null
  accent_color: string | null
  is_active: boolean
  display_order: number
}

export interface ChatThread {
  id: string
  user_id: string
  last_message: string | null
  last_message_at: string | null
  unread_for_user: boolean
  unread_for_staff: boolean
  created_at: string
}

export interface ChatMessage {
  id: string
  thread_id: string
  sender_id: string
  sender_role: "user" | "staff"
  content: string
  created_at: string
}

// Storage buckets (public read). Verified names.
export const QUOTE_PHOTOS_BUCKET = "quotes"
export const PROJECTS_BUCKET = "projects"
