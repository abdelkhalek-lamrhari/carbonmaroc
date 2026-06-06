import type { Metadata } from "next"
import type React from "react"
import { StaffShell } from "@/components/staff/staff-shell"

// Hidden internal area — keep it out of search engines. No public links point here.
export const metadata: Metadata = {
  title: "Espace Staff | Carbon Maroc",
  robots: { index: false, follow: false },
}

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return <StaffShell>{children}</StaffShell>
}
