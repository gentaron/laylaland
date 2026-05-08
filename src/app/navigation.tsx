"use client"

import Link from "next/link"
import { useLang } from "@/lib/use-lang"
import { LangToggle } from "@/platform/lang-toggle"
import { Sparkles } from "lucide-react"

export default function Navigation() {
  const { lang, setLang } = useLang()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-lg">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-sm font-medium text-pink-400/90 hover:text-pink-300 transition-colors">
          <Sparkles className="w-4 h-4" />
          <span>Laylaland</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/timeline" className="text-xs text-white/50 hover:text-pink-400 transition-colors">Timeline</Link>
          <Link href="/wiki" className="text-xs text-white/50 hover:text-pink-400 transition-colors">Wiki</Link>
          <LangToggle lang={lang} setLang={setLang} />
        </div>
      </div>
    </nav>
  )
}
