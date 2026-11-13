"use client"

import { useEffect, useRef, useState } from "react"
import { Send, Trash2 } from "lucide-react"

type Role = "user" | "assistant"
interface ChatMessage {
  role: Role
  content: string
}

const STORAGE_KEY = "laylaland-chat-history"
const GREETING: ChatMessage = {
  role: "assistant",
  content: "よっ！Pink Voltage、レイラだよ。*ツインテールを揺らして着地* ……で、キミは誰？今日はなんの話する？",
}

function loadHistory(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return [GREETING]
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [GREETING]
  } catch {
    return [GREETING]
  }
}

function saveHistory(messages: ChatMessage[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-200)))
  } catch {
    // 保存できない環境では、このタブの中だけで会話を続ける
  }
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMessages(loadHistory())
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  async function send() {
    const text = input.trim()
    if (!text || loading) return
    const next = [...messages, { role: "user" as const, content: text }]
    setMessages(next)
    saveHistory(next)
    setInput("")
    setError(null)
    setLoading(true)
    try {
      const res = await fetch("/api/layla-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      })
      const data = await res.json()
      if (!res.ok || !data.reply) {
        setError(data.error || "うまく届かなかったみたい。もう一回送ってみて。")
        return
      }
      const withReply = [...next, { role: "assistant" as const, content: data.reply }]
      setMessages(withReply)
      saveHistory(withReply)
    } catch {
      setError("接続できなかった。電波、大丈夫？")
    } finally {
      setLoading(false)
    }
  }

  function reset() {
    setMessages([GREETING])
    saveHistory([GREETING])
    setError(null)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-20 pb-4 px-4 flex flex-col">
      <div className="max-w-2xl w-full mx-auto flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://raw.githubusercontent.com/gentaron/image/main/LaylaVirelNova.png"
              alt="Layla"
              className="w-10 h-10 rounded-full object-cover border border-pink-500/40"
            />
            <div>
              <p className="text-sm text-pink-300">レイラ・ヴィレル・ノヴァ</p>
              <p className="text-[11px] text-white/40">Pink Voltage</p>
            </div>
          </div>
          <button
            onClick={reset}
            className="text-white/40 hover:text-pink-400 transition-colors p-2"
            aria-label="会話をリセット"
            title="会話をリセット"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pb-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
                  m.role === "user"
                    ? "bg-pink-500/80 text-white rounded-br-sm"
                    : "bg-white/5 text-white/85 border border-white/10 rounded-bl-sm"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          {loading && <div className="text-xs text-pink-300/60 animate-pulse">レイラが入力中…</div>}
          {error && <div className="text-xs text-red-400/80">{error}</div>}
          <div ref={bottomRef} />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            send()
          }}
          className="flex gap-2 sticky bottom-4"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            maxLength={1000}
            placeholder="レイラに話しかける…"
            className="flex-1 rounded-full bg-white/5 border border-white/10 px-4 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-pink-500/50"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="rounded-full bg-pink-500 px-4 text-white disabled:opacity-40"
            aria-label="送信"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  )
}
