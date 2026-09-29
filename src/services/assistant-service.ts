/**
 * Waste Assistant service layer.
 *
 * The chat UI only ever talks to these functions, so when the real chat
 * backend lands the swap happens here without touching UI code. Current
 * implementation matches canned keyword replies from constants/assistant.
 */

import {
  ASSISTANT_REPLIES,
  FALLBACK_REPLY,
  FOLLOW_UP_QUESTION,
  type AssistantReply,
} from "@/constants/assistant";

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

/**
 * Builds the assistant's response to one user message.
 * Idea replies get their ideas attached plus the follow-up question;
 * the fallback is a plain text bubble.
 */
export function getAssistantResponse(
  userMessage: string,
): AssistantChatMessage[] {
  const reply = findReply(userMessage);

  if (reply.ideas.length === 0) {
    return [
      {
        id: nextMessageId(),
        role: "assistant",
        at: new Date().toISOString(),
        text: reply.text,
      },
    ];
  }

  return [
    {
      id: nextMessageId(),
      role: "assistant",
      at: new Date().toISOString(),
      text: reply.text,
      ideas: reply.ideas,
    },
    {
      id: nextMessageId(),
      role: "assistant",
      at: new Date().toISOString(),
      text: FOLLOW_UP_QUESTION,
    },
  ];
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

/** Builds the opening assistant bubble shown before any interaction. */
export function getWelcomeMessage(): AssistantChatMessage {
  return {
    id: "assistant-welcome",
    role: "assistant",
    at: new Date().toISOString(),
    text: "welcome",
  };
}
