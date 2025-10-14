import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    console.log("[v0] Sending quote to Make.com:", body)

    // Send to Make.com webhook
    const response = await fetch("https://hook.eu2.make.com/j564hqhpils6ct73gr4uagfesdt2iqof", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-make-apikey": "carbon",
      },
      body: JSON.stringify(body),
    })

    console.log("[v0] Make.com response status:", response.status)

    const responseText = await response.text()
    console.log("[v0] Make.com response:", responseText)

    if (!response.ok) {
      console.error("[v0] Make.com error:", responseText)
      return NextResponse.json({ error: "Failed to submit quote", details: responseText }, { status: response.status })
    }

    return NextResponse.json({ success: true, message: "Quote submitted successfully" })
  } catch (error) {
    console.error("[v0] Error in quote API route:", error)
    return NextResponse.json({ error: "Internal server error", details: String(error) }, { status: 500 })
  }
}
