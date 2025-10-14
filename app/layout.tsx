import type React from "react"
import type { Metadata } from "next"
import { Bebas_Neue, Urbanist, Rye } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { ChatbaseWidget } from "@/components/chatbase-widget"
import "./globals.css"

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
})

const urbanist = Urbanist({
  subsets: ["latin"],
  variable: "--font-urbanist",
})

const oldStar = Rye({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-oldstar",
})

export const metadata: Metadata = {
  title: "Carbon Maroc | Premium Car Wrapping & Customization - Casablanca",
  description:
    "Transform your vehicle with Carbon Maroc - Casablanca's premier car wrapping and customization studio. Expert craftsmanship, premium materials, and street-style perfection.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${urbanist.variable} ${bebasNeue.variable} ${oldStar.variable} font-sans antialiased`}>
        <Suspense fallback={null}>{children}</Suspense>
        <ChatbaseWidget />
        <Analytics />
      </body>
    </html>
  )
}
