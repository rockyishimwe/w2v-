import { afterEach, describe, expect, it, vi } from "vitest";
import { analyzeWastePhoto, assistantReply, recyclingTips } from "./ai-service";

/**
 * The Groq client is mocked at the module boundary (the spec requires
 * mocking the Groq client — no network in tests).
 */
vi.mock("../lib/groq", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../lib/groq")>();
  return {
    ...actual,
    groqChat: vi.fn(),
    isGroqConfigured: vi.fn(() => true),
  };
});

import { groqChat } from "../lib/groq";
const mockedChat = vi.mocked(groqChat);

const validScanJson = JSON.stringify({
  title: "Glass jar",
  material: "Glass",
  category: "Container",
  confidence: 93,
  detectedSummary: "1 glass jar (approx. 500 ml)",
  condition: "Good",
  estimatedSize: "500 ml",
  tip: { title: "Great find!", body: "Glass is reusable many times." },
  recommendations: [
    { category: "Reuse", description: "Store spices" },
    { category: "DIY", description: "Make a planter" },
    { category: "Recycle", description: "Drop at a collection point" },
  ],
});

const validAssistantJson = JSON.stringify({
  text: "Plastic bottles make great planters!",
  ideas: [
    {
      title: "Vertical Herb Garden",
      difficulty: "Easy",
      time: "30 min",
      description: "Cut and mount bottles on a wall rack.",
    },
  ],
});

describe("analyzeWastePhoto", () => {
  afterEach(() => {
    mockedChat.mockReset();
  });

  it("returns the parsed AI scan result", async () => {
    mockedChat.mockResolvedValue(validScanJson);
    const result = await analyzeWastePhoto("data:image/jpeg;base64,abc", "en");
    expect(result.source).toBe("ai");
    expect(result.title).toBe("Glass jar");
    expect(result.recommendations).toHaveLength(3);
  });

  it("retries once when the first response is invalid JSON", async () => {
    mockedChat
      .mockResolvedValueOnce("this is not json at all")
      .mockResolvedValueOnce(validScanJson);
    const result = await analyzeWastePhoto("data:image/jpeg;base64,abc", "en");
    expect(result.source).toBe("ai");
    expect(mockedChat).toHaveBeenCalledTimes(2);
  });

  it("falls back when the model keeps failing", async () => {
    mockedChat.mockRejectedValue(new Error("boom"));
    const result = await analyzeWastePhoto("data:image/jpeg;base64,abc", "en");
    expect(result.source).toBe("fallback");
    expect(result.title).toBeTruthy();
  });

  it("extracts JSON wrapped in code fences", async () => {
    mockedChat.mockResolvedValue(
      `Here you go:\n\`\`\`json\n${validScanJson}\n\`\`\``,
    );
    const result = await analyzeWastePhoto("data:image/jpeg;base64,abc", "en");
    expect(result.material).toBe("Glass");
  });
});

describe("assistantReply", () => {
  afterEach(() => {
    mockedChat.mockReset();
  });

  it("returns the parsed reply with ideas", async () => {
    mockedChat.mockResolvedValue(validAssistantJson);
    const reply = await assistantReply("I have plastic bottles", [], "en");
    expect(reply.source).toBe("ai");
    expect(reply.ideas).toHaveLength(1);
    expect(reply.ideas[0].title).toBe("Vertical Herb Garden");
  });

  it("falls back to the canned keyword reply on failure", async () => {
    mockedChat.mockRejectedValue(new Error("boom"));
    const reply = await assistantReply("hello", [], "en");
    expect(reply.source).toBe("fallback");
    expect(reply.text).toMatch(/tell me what materials/i);
    expect(reply.ideas).toHaveLength(0);
  });

  it("falls back to canned material replies with artKeys", async () => {
    mockedChat.mockRejectedValue(new Error("boom"));
    const reply = await assistantReply("I have plastic bottles", [], "en");
    expect(reply.source).toBe("fallback");
    expect(reply.ideas).toHaveLength(3);
    expect(reply.ideas[0].artKey).toBe("vertical-herb-garden");
    expect(reply.ideas[0].href).toBe("/scanner/diy");
  });

  it("keeps fallback replies deterministic", async () => {
    mockedChat.mockRejectedValue(new Error("boom"));
    const fr = await assistantReply("hello", [], "fr");
    const en = await assistantReply("hello", [], "en");
    expect(fr.text).toBe(en.text); // canned copy is English by design
  });
});

describe("recyclingTips", () => {
  afterEach(() => {
    mockedChat.mockReset();
  });

  it("returns parsed tips", async () => {
    mockedChat.mockResolvedValue(
      JSON.stringify({ tips: ["Rinse first", "Remove caps", "Flatten"] }),
    );
    const { tips, source } = await recyclingTips("Plastic", "en");
    expect(source).toBe("ai");
    expect(tips).toEqual(["Rinse first", "Remove caps", "Flatten"]);
  });

  it("falls back to deterministic tips on failure", async () => {
    mockedChat.mockRejectedValue(new Error("boom"));
    const { tips, source } = await recyclingTips("Glass", "en");
    expect(source).toBe("fallback");
    expect(tips.length).toBeGreaterThan(0);
  });
});
