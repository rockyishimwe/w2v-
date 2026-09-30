import { describe, expect, it } from "vitest";
import {
  ASSISTANT_CARD,
  DID_YOU_KNOW,
  DISCOVER_CATEGORIES,
  DISCOVER_HERO,
  POPULAR_SEARCHES,
  TIP_MATERIALS,
} from "./discover";

describe("discover UI constants", () => {
  it("has the design's six category chips", () => {
    expect(DISCOVER_CATEGORIES.map(({ label }) => label)).toEqual([
      "All",
      "Plastic",
      "Glass",
      "Cardboard",
      "Organic",
      "Textile",
    ]);
  });

  it("has complete hero copy", () => {
    expect(DISCOVER_HERO.pill).toBeTruthy();
    expect(DISCOVER_HERO.title).toBeTruthy();
    expect(DISCOVER_HERO.body).toBeTruthy();
    expect(DISCOVER_HERO.cta).toBeTruthy();
  });

  it("has complete right-rail card copy", () => {
    expect(DID_YOU_KNOW.title).toBeTruthy();
    expect(DID_YOU_KNOW.body).toBeTruthy();
    expect(ASSISTANT_CARD.title).toBeTruthy();
    expect(ASSISTANT_CARD.body).toBeTruthy();
  });

  it("has at least four popular searches", () => {
    expect(POPULAR_SEARCHES.length).toBeGreaterThanOrEqual(4);
    for (const term of POPULAR_SEARCHES) {
      expect(term).toBeTruthy();
    }
  });

  it("offers several tip materials for the AI tips widget", () => {
    expect(TIP_MATERIALS.length).toBeGreaterThanOrEqual(3);
    for (const material of TIP_MATERIALS) {
      expect(material).toBeTruthy();
    }
  });
});
