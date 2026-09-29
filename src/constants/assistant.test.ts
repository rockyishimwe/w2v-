import { describe, expect, it } from "vitest";
import {
  ASSISTANT_CHIPS,
  ASSISTANT_REPLIES,
  FALLBACK_REPLY,
  FOLLOW_UP_QUESTION,
  PLASTIC_BOTTLE_REPLY,
  WELCOME_MESSAGE,
  type AssistantIdea,
} from "./assistant";

describe("assistant chips", () => {
  it("matches the design's six chips", () => {
    expect(ASSISTANT_CHIPS.map((c) => c.label)).toEqual([
      "I have plastic items",
      "I have cardboard",
      "I have food scraps",
      "I have glass items",
      "I have old clothes",
      "Help me decide",
    ]);
  });

  it("gives every chip a message the service can respond to", () => {
    for (const chip of ASSISTANT_CHIPS) {
      expect(chip.message, chip.label).toBeTruthy();
      expect(chip.message, chip.label).not.toEqual(chip.label);
    }
  });
});

describe("welcome message", () => {
  it("has a complete payload", () => {
    expect(WELCOME_MESSAGE.greeting).toBeTruthy();
    expect(WELCOME_MESSAGE.body).toBeTruthy();
    expect(WELCOME_MESSAGE.prompt).toBeTruthy();
  });
});

describe("assistant replies", () => {
  it("every canned reply has text", () => {
    for (const reply of ASSISTANT_REPLIES) {
      expect(reply.text, reply.keywords.join()).toBeTruthy();
    }
  });

  it("keyword lists are unique across replies", () => {
    const all = ASSISTANT_REPLIES.flatMap((r) => r.keywords);
    expect(new Set(all).size).toBe(all.length);
  });

  it("idea cards are complete and link to the DIY guide", () => {
    const ideas: AssistantIdea[] = ASSISTANT_REPLIES.flatMap((r) => r.ideas);
    expect(ideas.length).toBeGreaterThanOrEqual(3);
    for (const idea of ideas) {
      expect(idea.title, idea.id).toBeTruthy();
      expect(["Easy", "Medium"], idea.id).toContain(idea.difficulty);
      expect(idea.time, idea.id).toBeTruthy();
      expect(idea.href, idea.id).toBe("/scanner/diy");
      expect(idea.artKey, idea.id).toBeTruthy();
    }
  });

  it("ids are unique across all replies", () => {
    const ids = ASSISTANT_REPLIES.flatMap((r) => r.ideas.map((i) => i.id));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("matches the design's plastic-bottle scenario", () => {
    expect(PLASTIC_BOTTLE_REPLY.ideas.map((i) => i.title)).toEqual([
      "Vertical Herb Garden",
      "Bird Feeder",
      "Pen Holder",
    ]);
    expect(PLASTIC_BOTTLE_REPLY.ideas.map((i) => i.difficulty)).toEqual([
      "Easy",
      "Easy",
      "Medium",
    ]);
    expect(PLASTIC_BOTTLE_REPLY.ideas.map((i) => i.time)).toEqual([
      "30 min",
      "20 min",
      "1 hr",
    ]);
  });

  it("keeps the fallback keyword-free with no ideas", () => {
    expect(FALLBACK_REPLY.keywords).toEqual([]);
    expect(FALLBACK_REPLY.ideas).toEqual([]);
    expect(FALLBACK_REPLY.text).toBeTruthy();
  });

  it("ends idea replies with a follow-up question", () => {
    expect(FOLLOW_UP_QUESTION).toBeTruthy();
  });
});
