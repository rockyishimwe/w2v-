/**
 * Waste Assistant service layer.
 *
 * The chat UI only ever talks to these functions. Replies now come from the
 * backend (POST /api/ai/assistant — Groq text model); when the backend is
 * unreachable or the user is offline, the canned keyword replies from
 * constants/assistant keep the conversation working.
 */

import {
  ASSISTANT_REPLIES,
  FALLBACK_REPLY,
  FOLLOW_UP_QUESTION,
  type AssistantReply,
} from "@/constants/assistant";
import { api } from "@/lib/api-client";

/** One message in the chat transcript. */
export interface AssistantChatMessage {
  id: string;
  role: "user" | "assistant";
  /** ISO timestamp the bubble was created. */
  at: string;
  text?: string;
  /** Idea cards attached to an assistant bubble. */
  ideas?: AssistantReply["ideas"];
}

/**
 * Server reply payload. Ideas may carry the UI's artKey/id/href (canned
 * fallbacks) or only title/difficulty/time (live AI) — the mapper below
 * handles both.
 */
interface ServerReply {
  text: string;
  ideas: Array<{
    title: string;
    difficulty: "Easy" | "Medium";
    time: string;
    description?: string;
    id?: string;
    artKey?: string;
    href?: string;
  }>;
}

/** Monotonic id counter for chat messages within the session. */
let messageCounter = 0;

function nextMessageId(): string {
  messageCounter += 1;
  return `assistant-msg-${messageCounter}`;
}

/** Finds the canned reply whose keywords match the user's message. */
export function findReply(message: string): AssistantReply {
  const normalized = message.toLowerCase();
  for (const reply of ASSISTANT_REPLIES) {
    if (reply.keywords.some((keyword) => normalized.includes(keyword))) {
      return reply;
    }
  }
  return FALLBACK_REPLY;
}

/** Wraps a user message in a chat message record. */
export function toUserMessage(text: string): AssistantChatMessage {
  return {
    id: nextMessageId(),
    role: "user",
    at: new Date().toISOString(),
    text,
  };
}

/**
 * Builds the assistant's response to one user message.
 * Calls the real AI backend; falls back to the canned replies when the
 * request fails so the chat keeps working offline.
 */
export async function getAssistantResponse(
  userMessage: string,
): Promise<AssistantChatMessage[]> {
  let text: string;
  let ideas: AssistantReply["ideas"];

  try {
    const reply = await api.post<ServerReply>("/api/ai/assistant", {
      message: userMessage,
    });
    text = reply.text;
    ideas = reply.ideas.map((idea, index) => ({
      id: idea.id ?? `ai-idea-${index + 1}`,
      title: idea.title,
      difficulty: idea.difficulty,
      time: idea.time,
      href: (idea.href ??
        "/scanner/diy") as AssistantReply["ideas"][number]["href"],
      artKey: idea.artKey ?? "vertical-herb-garden",
    }));
  } catch {
    const reply = findReply(userMessage);
    text = reply.text;
    ideas = reply.ideas;
  }

  const response: AssistantChatMessage[] = [
    {
      id: nextMessageId(),
      role: "assistant",
      at: new Date().toISOString(),
      text,
      ...(ideas.length > 0 ? { ideas } : {}),
    },
  ];

  // Follow-up prompt mirrors the canned behavior for idea replies.
  if (ideas.length > 0) {
    response.push({
      id: nextMessageId(),
      role: "assistant",
      at: new Date().toISOString(),
      text: FOLLOW_UP_QUESTION,
    });
  }

  return response;
}

/** Builds the opening assistant bubble shown before any interaction. */
export function getWelcomeMessage(): AssistantChatMessage {
  return {
    id: "assistant-welcome",
    role: "assistant",
    at: new Date().toISOString(),
    text: "welcome",
  };
}
