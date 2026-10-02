"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { NotificationBell } from "./notification-bell";
import {
  BotIcon,
  BoxIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ClockIcon,
  JarIcon,
  LeafIcon,
  LightbulbIcon,
  PaperclipIcon,
  RecycleIcon,
  SendIcon,
  ShirtIcon,
  SparkleIcon,
} from "./icons";
import { Avatar } from "./avatar";
import {
  ASSISTANT_CHIPS,
  WELCOME_MESSAGE,
  type AssistantChip,
} from "@/constants/assistant";
import {
  getAssistantResponse,
  getWelcomeMessage,
  toUserMessage,
  type AssistantChatMessage,
} from "@/services/assistant-service";
import { AssistantIdeaArt } from "./assistant-art";

/** Icons per quick-reply chip label (design row order). */
const CHIP_ICONS: Record<
  string,
  (props: { className?: string }) => React.ReactNode
> = {
  "I have plastic items": LeafIcon,
  "I have cardboard": BoxIcon,
  "I have food scraps": RecycleIcon,
  "I have glass items": JarIcon,
  "I have old clothes": ShirtIcon,
  "Help me decide": LightbulbIcon,
};

/** "10:24 AM" style stamp for a bubble. */
function timeLabel(iso: string): string {
  return new Date(iso).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function AssistantClient() {
  const [messages, setMessages] = useState<AssistantChatMessage[]>([
    getWelcomeMessage(),
  ]);
  const [draft, setDraft] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the newest bubble (welcome or after sending).
  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setDraft("");
    // API-backed reply: append the user bubble immediately, then the
    // assistant's response when it arrives.
    void getAssistantResponse(trimmed).then((reply) => {
      setMessages((prev) => [...prev, toUserMessage(trimmed), ...reply]);
    });
  }

  function sendChip(chip: AssistantChip) {
    send(chip.message);
  }

  return (
    <div className="flex min-h-[calc(100dvh-88px)] flex-col">
      {/* ── Top bar ─────────────────────────────────────────────── */}
      <header className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <h1 className="font-display text-[30px] font-bold leading-none text-black">
            Waste Assistant
          </h1>
          <p className="mt-2.5 text-[14px] text-[#607493]">
            Your AI guide for smarter waste decisions
          </p>
        </div>

        <div className="flex flex-1 flex-wrap items-center justify-end gap-4 pt-1 sm:flex-nowrap">
          <NotificationBell />

          <button
            type="button"
            aria-label="Account menu"
            className="flex shrink-0 items-center gap-1.5"
          >
            <Avatar className="h-11 w-11 rounded-full object-cover" />
            <ChevronDownIcon className="h-5 w-5 text-gray-900" />
          </button>
        </div>
      </header>

      {/* ── Transcript ──────────────────────────────────────────── */}
      <div ref={listRef} className="mt-7 flex-1" aria-live="polite">
        <MessageList messages={messages} onChip={sendChip} />
      </div>

      {/* ── Composer ────────────────────────────────────────────── */}
      <form
        className="sticky bottom-0 mt-6 pb-2"
        onSubmit={(event) => {
          event.preventDefault();
          send(draft);
        }}
      >
        <div className="flex items-center gap-3 rounded-full border border-gray-100 bg-white py-2.5 pl-6 pr-2.5 shadow-[0_8px_20px_rgba(17,24,39,0.05)]">
          <button
            type="button"
            aria-label="Attach a photo"
            className="shrink-0 text-gray-500 transition-colors hover:text-brand-700"
          >
            <PaperclipIcon className="h-5 w-5" />
          </button>
          <input
            type="text"
            name="message"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Type your message..."
            aria-label="Type your message"
            className="h-11 min-w-0 flex-1 bg-transparent text-[14.5px] text-gray-900 placeholder:text-gray-400 focus:outline-none"
          />
          <button
            type="submit"
            aria-label="Send message"
            disabled={!draft.trim()}
            className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full bg-brand-700 text-white shadow-[0_8px_16px_rgba(20,92,54,0.2)] transition-colors hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <SendIcon className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
}

/* ── Message list ─────────────────────────────────────────────── */

function MessageList({
  messages,
  onChip,
}: {
  messages: AssistantChatMessage[];
  onChip: (chip: AssistantChip) => void;
}) {
  // Chips render under the welcome bubble only, matching the design.
  const chipsShown =
    messages.length === 1 && messages[0].id === "assistant-welcome";

  return (
    <div className="flex flex-col gap-5">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}

      {chipsShown && (
        <div className="ml-[54px] grid max-w-[720px] grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ASSISTANT_CHIPS.map((chip) => {
            const ChipIcon = CHIP_ICONS[chip.label] ?? SparkleIcon;
            return (
              <button
                key={chip.label}
                type="button"
                onClick={() => onChip(chip)}
                className="flex h-[54px] items-center gap-3 rounded-2xl border border-gray-100 bg-white px-3 text-[13.5px] font-semibold text-gray-900 shadow-[0_6px_14px_rgba(17,24,39,0.04)] transition-colors hover:border-brand-300 hover:bg-brand-50"
              >
                <ChipIcon className="h-4.5 w-4.5 shrink-0 text-gray-800" />
                <span className="truncate">{chip.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── Bubble ───────────────────────────────────────────────────── */

function MessageBubble({ message }: { message: AssistantChatMessage }) {
  if (message.role === "user") {
    return (
      <div className="flex flex-col items-end">
        <div className="max-w-[85%] rounded-[24px] rounded-br-lg bg-brand-700 px-5 py-3.5 text-[14px] leading-relaxed text-white sm:max-w-[70%]">
          {message.text}
        </div>
        <p className="mt-1.5 flex items-center gap-1.5 pr-1 text-[11px] text-gray-400">
          {timeLabel(message.at)}
          <DeliveredMark />
        </p>
      </div>
    );
  }

  // Welcome bubble gets the design's heading + prompt structure.
  const isWelcome = message.id === "assistant-welcome";

  return (
    <div className="flex items-start gap-3.5">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-900 text-white shadow-sm">
        <BotIcon className="h-5 w-5" />
      </span>

      <div className="min-w-0 flex-1">
        <div className="inline-block max-w-[85%] rounded-[24px] rounded-tl-lg bg-pale-green px-5 py-3.5 text-[14px] leading-relaxed text-gray-700 sm:max-w-[75%]">
          {isWelcome ? (
            <>
              <p className="font-display text-[15px] font-bold text-brand-900">
                {WELCOME_MESSAGE.greeting}
              </p>
              <p className="mt-2">{WELCOME_MESSAGE.body}</p>
              <p className="mt-2 font-semibold text-gray-900">
                {WELCOME_MESSAGE.prompt}
              </p>
            </>
          ) : (
            message.text
          )}
        </div>

        {/* Idea cards attached to this bubble */}
        {message.ideas && message.ideas.length > 0 && (
          <ul className="mt-3 grid max-w-[820px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {message.ideas.map((idea) => (
              <li
                key={idea.id}
                className="overflow-hidden rounded-2xl border border-gray-100 bg-white p-2 shadow-[0_8px_18px_rgba(17,24,39,0.05)] transition-shadow hover:shadow-[0_10px_24px_rgba(17,24,39,0.1)]"
              >
                <div className="relative aspect-[1.25] overflow-hidden rounded-xl">
                  <AssistantIdeaArt
                    artKey={idea.artKey}
                    className="absolute inset-0 h-full w-full"
                  />
                </div>
                <div className="p-2 pb-2.5">
                  <p className="truncate text-[14px] font-bold text-gray-900">
                    {idea.title}
                  </p>
                  <p className="mt-2 flex items-center gap-3 text-[11.5px] text-gray-500">
                    <span className="flex items-center gap-1">
                      <LeafIcon className="h-3.5 w-3.5 text-brand-600" />
                      {idea.difficulty}
                    </span>
                    <span className="flex items-center gap-1">
                      <ClockIcon className="h-3.5 w-3.5" />
                      {idea.time}
                    </span>
                  </p>
                  <Link
                    href={idea.href}
                    className="mt-2.5 flex h-9 items-center justify-center gap-1.5 rounded-lg bg-pale-green text-[12.5px] font-semibold text-brand-700 transition-colors hover:bg-brand-100"
                  >
                    View details
                    <ChevronRightIcon className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}

        <p className="mt-1.5 text-[11px] text-gray-400">
          {timeLabel(message.at)}
        </p>
      </div>
    </div>
  );
}

function DeliveredMark() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="h-3.5 w-3.5"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="m2.5 8.5 3 3 8-8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m7 11.5.5.5 8-8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
