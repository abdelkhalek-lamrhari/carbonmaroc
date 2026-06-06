"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { translations, RTL_LANGS, type Lang, type Dict } from "./translations"

const DEFAULT_LANG: Lang = "fr"
const STORAGE_KEY = "cm_lang"

interface LanguageContextValue {
  lang: Lang
  setLang: (lang: Lang) => void
  dir: "ltr" | "rtl"
  /** Current dictionary (full object) — use for arrays/nested lists. */
  d: Dict
  /** Convenience getter for a dotted key, falls back to FR then the key itself. */
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

function dirFor(lang: Lang): "ltr" | "rtl" {
  return RTL_LANGS.includes(lang) ? "rtl" : "ltr"
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG)

  // Restore saved preference after mount (avoids hydration mismatch).
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Lang | null
    if (saved && translations[saved]) setLangState(saved)
  }, [])

  // Keep <html lang/dir> in sync.
  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = dirFor(lang)
  }, [lang])

  const setLang = (next: Lang) => {
    setLangState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* ignore */
    }
  }

  const d = translations[lang]
  const t = (key: string): string => {
    const read = (obj: unknown) =>
      key.split(".").reduce<unknown>((acc, k) => (acc == null ? undefined : (acc as Record<string, unknown>)[k]), obj)
    const val = read(d) ?? read(translations[DEFAULT_LANG])
    return typeof val === "string" ? val : key
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, dir: dirFor(lang), d, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider")
  return ctx
}
