/**
 * Groq SDK client (server-only) with free-tier model defaults.
 *
 * Models are env-configurable. As of Sep 2026 the Groq developer (free)
 * plan serves these production models:
 *   - openai/gpt-oss-20b        → fast small text model (default TEXT)
 *   - openai/gpt-oss-120b       → larger reasoning model (default REASONING)
 *   - meta-llama/llama-4-scout  → vision-capable model (default VISION)
 * (llama-3.1-8b-instant / llama-3.3-70b-versatile moved to Enterprise.)
 * Verify current IDs at https://console.groq.com/docs/models.
 */
import Groq from "groq-sdk";
import { logger } from "./logger";

export const GROQ_TEXT_MODEL =
  process.env.GROQ_TEXT_MODEL ?? "openai/gpt-oss-20b";
export const GROQ_REASONING_MODEL =
  process.env.GROQ_REASONING_MODEL ?? "openai/gpt-oss-120b";
export const GROQ_VISION_MODEL =
  process.env.GROQ_VISION_MODEL ?? "qwen/qwen3.8-27b";

/** Whether AI features are live (they degrade to fallbacks when false). */
export function isGroqConfigured(): boolean {
  return Boolean(process.env.GROQ_API_KEY);
}

let client: Groq | null = null;

/** Lazily-constructed Groq SDK singleton (throws when key is missing). */
export function getGroqClient(): Groq {
  if (!isGroqConfigured()) {
    throw new Error("GROQ_API_KEY is not set");
  }
  client ??= new Groq({ apiKey: process.env.GROQ_API_KEY, maxRetries: 0 });
  return client;
}

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content:
    | string
    | Array<
        | { type: "text"; text: string }
        | { type: "image_url"; image_url: { url: string } }
      >;
}

const INITIAL_TIMEOUT_MS = 30_000;
const MAX_ATTEMPTS = 3;

/**
 * Total wall-clock budget for one groqChat call, retries and backoff
 * included. Serverless platforms kill a function at a fixed duration
 * (see `maxDuration` on the AI routes), and a request killed mid-flight
 * returns a gateway error instead of this module's fallback content — so
 * the budget has to be the smaller number. Two sequential calls (a vision
 * pass plus a JSON-repair pass) must still fit inside it.
 */
const BUDGET_MS = 20_000;

/**
 * Runs a chat completion with timeout, exponential backoff on
 * 429/5xx/network errors (matching the SDK's own retryable classification),
 * and small max_tokens to keep responses light for low-bandwidth users.
 */
export async function groqChat(
  messages: ChatMessage[],
  options: {
    model?: string;
    jsonMode?: boolean;
    maxTokens?: number;
    temperature?: number;
    timeoutMs?: number;
    /** Total budget across retries (default 20s). */
    budgetMs?: number;
  } = {},
): Promise<string> {
  const groq = getGroqClient();
  const {
    model = GROQ_TEXT_MODEL,
    jsonMode = false,
    maxTokens = 700,
    temperature = 0.4,
    timeoutMs = INITIAL_TIMEOUT_MS,
    budgetMs = BUDGET_MS,
  } = options;

  const deadline = Date.now() + budgetMs;
  let lastError: unknown = null;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    // Never start an attempt that cannot plausibly finish in time.
    const remainingMs = deadline - Date.now();
    if (remainingMs < 2_000) break;

    try {
      const completion = await groq.chat.completions.create(
        {
          model,
          messages: messages as never,
          temperature,
          max_tokens: maxTokens,
          // gpt-oss models emit hidden reasoning that eats the token
          // budget before any content is written — keep it minimal.
          ...(model.includes("gpt-oss")
            ? { reasoning_effort: "low" as const }
            : {}),
          ...(jsonMode ? { response_format: { type: "json_object" } } : {}),
        },
        { timeout: Math.min(timeoutMs, remainingMs) },
      );
      const content = completion.choices[0]?.message?.content ?? "";
      if (!content.trim()) {
        throw new Error("Empty AI response");
      }
      return content;
    } catch (error) {
      lastError = error;
      const status =
        typeof error === "object" && error !== null && "status" in error
          ? Number((error as { status?: number }).status)
          : undefined;
      const retryable =
        status === 429 || (status !== undefined && status >= 500);
      const retriableNetwork =
        error instanceof Error &&
        ["ECONNRESET", "ETIMEDOUT", "EAI_AGAIN"].some((code) =>
          error.message.includes(code),
        );

      if (!retryable && !retriableNetwork) throw error;
      if (attempt === MAX_ATTEMPTS) break;

      const backoffMs = 2 ** attempt * 500; // 1s, 2s
      // Spending the remaining budget on a sleep would leave nothing for
      // the retry itself; fail now so the caller can serve its fallback.
      if (deadline - Date.now() < backoffMs + 2_000) break;
      logger.warn("groq retry", { attempt, backoffMs, status });
      await new Promise((resolve) => setTimeout(resolve, backoffMs));
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error(`Groq request failed (budget ${budgetMs}ms exhausted)`);
}
