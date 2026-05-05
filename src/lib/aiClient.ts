import Anthropic from "@anthropic-ai/sdk";
import { extractTextFromAnthropicMessageContent } from "@/lib/anthropicMessageText";

const rawProvider = process.env.AI_PROVIDER?.toLowerCase().trim();

export const isOllama = rawProvider === "ollama";

/** Base URL including `/v1` (e.g. `http://localhost:11434/v1`). Ollama serves OpenAI-compatible paths under this prefix. */
const ollamaV1Base =
  process.env.OLLAMA_BASE_URL?.trim() || "http://localhost:11434/v1";

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY ?? "",
});

/** Messages API model id for interpret-trip (Anthropic id or Ollama tag per AI_PROVIDER). */
export const aiMessagesModel = isOllama
  ? process.env.OLLAMA_MODEL?.trim() || "llama3.3:70b"
  : process.env.ANTHROPIC_MODEL?.trim() || "claude-sonnet-4-6";

/** Local models often need a larger completion budget than Claude so JSON is not cut off mid-stream. */
function ollamaMaxTokens(): number {
  const raw = process.env.OLLAMA_MAX_TOKENS?.trim();
  if (!raw) return 16384;
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n)) return 16384;
  return Math.min(Math.max(n, 4096), 65536);
}

/**
 * Anthropic uses `/v1/messages`; Ollama exposes OpenAI-compatible `/v1/chat/completions`.
 * The Anthropic SDK pointed at Ollama returns 404 — call the chat endpoint explicitly for local runs.
 */
export async function completeInterpretTripPrompt(
  userPrompt: string,
): Promise<string> {
  console.log(
    `%c isOllama`,
    "color: #FF10F0;",
    isOllama,
    aiMessagesModel,
  );
  if (isOllama) {
    const url = `${ollamaV1Base.replace(/\/$/, "")}/chat/completions`;
    const t0 = Date.now();
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: aiMessagesModel,
        messages: [{ role: "user", content: userPrompt }],
        max_tokens: ollamaMaxTokens(),
      }),
    });
    const raw = await res.text();
    console.log(
      `[ollama] chat/completions finished in ${Date.now() - t0}ms (status ${res.status})`,
    );
    if (!res.ok) {
      throw new Error(`Ollama ${res.status}: ${raw.slice(0, 500)}`);
    }
    let data: {
      choices?: Array<{ message?: { content?: string | null } }>;
    };
    try {
      data = JSON.parse(raw) as typeof data;
    } catch {
      throw new Error(`Ollama returned non-JSON: ${raw.slice(0, 200)}`);
    }
    const text = data.choices?.[0]?.message?.content;
    if (text == null || text === "") {
      throw new Error("Ollama returned empty message content");
    }
    return text;
  }

  const t0 = Date.now();
  const message = await anthropic.messages.create({
    model: aiMessagesModel,
    max_tokens: 8192,
    messages: [{ role: "user", content: userPrompt }],
  });
  console.log(
    `[anthropic] messages.create finished in ${Date.now() - t0}ms`,
  );
  return extractTextFromAnthropicMessageContent(message.content);
}
