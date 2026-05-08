"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Clock, BookOpen, Sparkles, ArrowRight } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-pink-500/5 via-transparent to-transparent" />
        <div className="max-w-4xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-xs tracking-[0.3em] uppercase text-pink-500/60 mb-4">
              AURALIS — Symphony of Stars
            </p>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-light tracking-tight text-white/90 mb-6"
          >
            <span className="text-pink-400">Layla</span>land
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base text-white/40 max-w-xl leading-relaxed"
          >
            Pink Voltage — レイラ・ヴィレル・ノヴァの公式サイト。
            AURALISの嵐を加速させたピンクの電撃、その全て。
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 flex items-center gap-2 text-xs text-pink-500/40"
          >
            <Sparkles className="w-3 h-3" />
            <span>Pink Voltage Strikes Forever</span>
          </motion.div>
        </div>
      </section>

      {/* Sections */}
      <section className="max-w-4xl mx-auto px-4 pb-20">
        <div className="grid sm:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link
              href="/timeline"
              className="group block p-6 rounded-lg border border-pink-500/10 bg-pink-500/[0.02] hover:border-pink-500/25 hover:bg-pink-500/[0.04] transition-all"
            >
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-pink-500/70" />
                <h2 className="text-sm font-medium text-white/80">Timeline</h2>
                <ArrowRight className="w-3 h-3 text-pink-500/40 ml-auto group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-xs text-white/30 leading-relaxed">
                AURALIS加入からの軌跡。嵐の全記録。
              </p>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link
              href="/wiki"
              className="group block p-6 rounded-lg border border-pink-500/10 bg-pink-500/[0.02] hover:border-pink-500/25 hover:bg-pink-500/[0.04] transition-all"
            >
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-4 h-4 text-pink-500/70" />
                <h2 className="text-sm font-medium text-white/80">Wiki</h2>
                <ArrowRight className="w-3 h-3 text-pink-500/40 ml-auto group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-xs text-white/30 leading-relaxed">
                キャラクター、用語、組織、歴史など、世界観の百科事典。
              </p>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
