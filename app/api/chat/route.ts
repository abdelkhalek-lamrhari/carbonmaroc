import { NextResponse } from "next/server"

// Server-only Mistral proxy. The MISTRAL_API_KEY never reaches the browser.
export const runtime = "nodejs"

const SYSTEM_PROMPT_CARBON_MAROC = `Tu es l'assistant virtuel de Carbon Maroc, un studio premium de covering automobile à Casablanca.

Ton rôle :
- Conseiller les clients sur les types de wraps (mat, brillant, satin, métallisé, chrome, carbone) et leurs caractéristiques
- Aider à choisir une finition en fonction du véhicule et du style recherché
- Expliquer le processus de pose, la durabilité, l'entretien
- Encourager les clients à demander un devis ou prendre rendez-vous via l'app ou le site
- Répondre toujours en français, ton chaleureux mais professionnel
- Ne donne JAMAIS de prix exact, dis toujours 'demandez un devis'
- Si on te pose une question hors sujet (politique, code, etc.), recadre poliment vers le covering automobile

Restes concis : 3-5 phrases maximum sauf si le client demande des détails techniques.`

interface ChatMessage {
  role: "user" | "assistant" | "system"
  content: string
}

export async function POST(request: Request) {
  const apiKey = process.env.MISTRAL_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: "Mistral key manquante" }, { status: 500 })
  }

  let messages: ChatMessage[] = []
  try {
    const body = await request.json()
    messages = Array.isArray(body?.messages) ? body.messages : []
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide" }, { status: 400 })
  }

  // Keep only role/content, drop anything else, cap to the last 20 turns.
  const safe = messages
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-20)
    .map((m) => ({ role: m.role, content: m.content }))

  try {
    const upstream = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "mistral-large-latest",
        messages: [{ role: "system", content: SYSTEM_PROMPT_CARBON_MAROC }, ...safe],
        temperature: 0.6,
        max_tokens: 600,
      }),
    })

    if (!upstream.ok) {
      const detail = await upstream.text()
      console.error("[api/chat] mistral error:", upstream.status, detail)
      return NextResponse.json({ error: "Erreur Mistral" }, { status: 502 })
    }

    const data = await upstream.json()
    const reply: string = data?.choices?.[0]?.message?.content ?? ""
    return NextResponse.json({ reply })
  } catch (err) {
    console.error("[api/chat] error:", err)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
