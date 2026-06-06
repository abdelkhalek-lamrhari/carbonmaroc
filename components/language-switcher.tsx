"use client"

import { Globe } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
import { LANGS, LANG_LABELS } from "@/lib/i18n/translations"

// Compact FR / EN / ع segmented control matching the street aesthetic.
export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { lang, setLang } = useLanguage()

  return (
    <div className={`flex items-center gap-1 border-2 border-primary/30 bg-black/40 px-1 py-1 ${className}`}>
      <Globe className="w-4 h-4 text-primary mx-1 shrink-0" strokeWidth={2.5} />
      {LANGS.map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={`font-display text-sm tracking-widest px-2 py-1 transition-all ${
            lang === l
              ? "bg-primary text-black"
              : "text-gray-300 hover:text-primary"
          }`}
        >
          {LANG_LABELS[l]}
        </button>
      ))}
    </div>
  )
}
