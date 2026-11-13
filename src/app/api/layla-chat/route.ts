import { NextResponse } from "next/server"
import { LAYLA_SYSTEM_PROMPT } from "@/lib/layla-persona"

// Groq の無料枠で動かす。モデルは環境変数で差し替えられる。
// 既定は production 枠の openai/gpt-oss-120b（旧 llama3-8b-8192 は 2025-08 に廃止）。
const DEFAULT_MODEL = "openai/gpt-oss-120b"
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"

// 無料枠のトークン上限に収めるための上限値
const MAX_TURNS = 20 // 送る履歴の最大件数
const MAX_CHARS_PER_MESSAGE = 1000
const MAX_OUTPUT_TOKENS = 400

type Role = "user" | "assistant"
interface ChatMessage {
  role: Role
  content: string
}

function sanitize(input: unknown): ChatMessage[] {
  if (!Array.isArray(input)) return []
  return input
    .filter(
      (m): m is ChatMessage =>
        !!m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim().length > 0,
    )
    .slice(-MAX_TURNS)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS_PER_MESSAGE) }))
}

async function callGroq(apiKey: string, model: string, messages: ChatMessage[], withReasoningParam: boolean) {
  const body: Record<string, unknown> = {
    model,
    messages: [{ role: "system", content: LAYLA_SYSTEM_PROMPT }, ...messages],
    max_tokens: MAX_OUTPUT_TOKENS,
    temperature: 0.9,
  }
  // gpt-oss は推論モデル。会話用なので推論は軽くして速さと枠を優先する。
  if (withReasoningParam) body.reasoning_effort = "low"

  return fetch(GROQ_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
}

export async function POST(req: Request) {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: "GROQ_API_KEY が設定されていません" }, { status: 500 })
  }
  const model = process.env.GROQ_MODEL || DEFAULT_MODEL

  let payload: { messages?: unknown; message?: unknown }
  try {
    payload = await req.json()
  } catch {
    return NextResponse.json({ error: "JSON が読めません" }, { status: 400 })
  }

  // 旧形式 { message } も受ける
  const messages =
    payload.messages !== undefined
      ? sanitize(payload.messages)
      : sanitize([{ role: "user", content: payload.message }])

  if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
    return NextResponse.json({ error: "最後のメッセージはユーザーの発言にしてください" }, { status: 400 })
  }

  try {
    let res = await callGroq(apiKey, model, messages, true)
    // reasoning_effort を受け付けないモデルに差し替えた場合の保険
    if (res.status === 400) res = await callGroq(apiKey, model, messages, false)

    if (res.status === 429) {
      return NextResponse.json(
        { error: "ちょっと話しすぎたかも。少し待ってからもう一回話しかけて！" },
        { status: 429 },
      )
    }
    if (!res.ok) {
      console.error("Groq error", res.status, await res.text())
      return NextResponse.json({ error: `接続エラー (${res.status})` }, { status: 502 })
    }

    const data = await res.json()
    const reply: string | undefined = data.choices?.[0]?.message?.content?.trim()
    if (!reply) {
      return NextResponse.json({ error: "返事が空でした" }, { status: 502 })
    }
    return NextResponse.json({ reply })
  } catch (e) {
    console.error("layla-chat failed", e)
    return NextResponse.json({ error: "接続できませんでした" }, { status: 502 })
  }
}
