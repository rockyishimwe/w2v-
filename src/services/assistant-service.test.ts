import { describe, expect, it } from "vitest";
import {
  findReply,
  getAssistantResponse,
  getWelcomeMessage,
  toUserMessage,
} from "./assistant-service";
import {
  FALLBACK_REPLY,
  FOLLOW_UP_QUESTION,
  GLASS_REPLY,
  PLASTIC_BOTTLE_REPLY,
} from "@/constants/assistant";

describe("findReply", () => {
  it("routes plastic messages to the plastic reply", () => {
    expect(
      findReply("I have some plastic bottles. What can I do with them?"),
    ).toBe(PLASTIC_BOTTLE_REPLY);
  });

  it("matches keywords case-insensitively", () => {
    expect(findReply("I have GLASS jars")).toBe(GLASS_REPLY);
  });

  it("matches partial substrings", () => {
    expect(findReply("plastics of all kinds")).toBe(PLASTIC_BOTTLE_REPLY);
  });

  it("falls back when nothing matches", () => {
    expect(findReply("hello there")).toBe(FALLBACK_REPLY);
  });

  it("falls back for the empty string", () => {
    expect(findReply("")).toBe(FALLBACK_REPLY);
  });
});

describe("getAssistantResponse", () => {
  it("attaches ideas and a follow-up bubble for material replies", () => {
    const response = getAssistantResponse(
      "I have some plastic bottles. What can I do with them?",
    );
    expect(response).toHaveLength(2);
    expect(response[0].ideas).toEqual(PLASTIC_BOTTLE_REPLY.ideas);
    expect(response[0].text).toBe(PLASTIC_BOTTLE_REPLY.text);
    expect(response[1].text).toBe(FOLLOW_UP_QUESTION);
    expect(response.every((m) => m.role === "assistant")).toBe(true);
  });

  it("returns a single text bubble for the fallback", () => {
    const response = getAssistantResponse("good morning");
    expect(response).toHaveLength(1);
    expect(response[0].ideas).toBeUndefined();
    expect(response[0].text).toBe(FALLBACK_REPLY.text);
  });

  it("gives every message a unique id and timestamp", () => {
    const [a, b] = getAssistantResponse("I have cardboard");
    expect(a.id).not.toBe(b.id);
    expect(new Date(a.at).toString()).not.toBe("Invalid Date");
  });
});

describe("message builders", () => {
  it("wraps user text in a user message", () => {
    const message = toUserMessage("I have glass jars");
    expect(message.role).toBe("user");
    expect(message.text).toBe("I have glass jars");
    expect(message.id).toBeTruthy();
  });

  it("keeps message ids unique across builders", () => {
    const a = toUserMessage("one");
    const [b] = getAssistantResponse("one");
    expect(a.id).not.toBe(b.id);
  });

  it("marks the welcome bubble as assistant role", () => {
    const welcome = getWelcomeMessage();
    expect(welcome.role).toBe("assistant");
    expect(welcome.id).toBe("assistant-welcome");
  });
});
