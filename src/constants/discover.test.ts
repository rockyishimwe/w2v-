import { describe, expect, it } from "vitest";
import {
  ASSISTANT_CARD,
  DID_YOU_KNOW,
  DISCOVER_CATEGORIES,
  DISCOVER_HERO,
  POPULAR_SEARCHES,
  RECOMMENDED_IDEAS,
  RECYCLING_TIPS,
  TRENDING_IDEAS,
  filterIdeasByCategory,
  type DiscoverIdea,
} from "./discover";

const VALID_TAGS = ["DIY", "Reuse"] as const;
const VALID_CATEGORIES = [
  "Plastic",
  "Glass",
  "Cardboard",
  "Organic",
  "Textile",
] as const;

function makeIdea(overrides: Partial<DiscoverIdea> = {}): DiscoverIdea {
  return {
    id: "test-idea",
    title: "Test Idea",
    description: "A test idea.",
    tag: "DIY",
    time: "1 hour",
    impact: "1 item reused",
    categories: ["Plastic"],
    artKey: "test-idea",
    ...overrides,
  };
}

describe("discover content", () => {
  it("has a complete hero payload", () => {
    expect(DISCOVER_HERO.pill).toBeTruthy();
    expect(DISCOVER_HERO.title).toBeTruthy();
    expect(DISCOVER_HERO.body).toBeTruthy();
    expect(DISCOVER_HERO.cta).toBeTruthy();
  });

  it("exports every category chip from the design", () => {
    expect(DISCOVER_CATEGORIES.map((c) => c.label)).toEqual([
      "All",
      "Plastic",
      "Glass",
      "Cardboard",
      "Organic",
      "Textile",
    ]);
  });

  it("keeps popular searches and tips non-empty and unique", () => {
    for (const list of [POPULAR_SEARCHES, RECYCLING_TIPS]) {
      expect(list.length).toBeGreaterThan(0);
      expect(new Set(list).size).toBe(list.length);
      for (const entry of list) expect(entry).toBeTruthy();
    }
  });

  it("populates the right rail cards", () => {
    expect(DID_YOU_KNOW.title).toBeTruthy();
    expect(DID_YOU_KNOW.body).toBeTruthy();
    expect(ASSISTANT_CARD.title).toBeTruthy();
    expect(ASSISTANT_CARD.body).toBeTruthy();
    expect(ASSISTANT_CARD.cta).toBeTruthy();
  });
});

describe("idea lists", () => {
  it("have the design's three cards per rail", () => {
    expect(TRENDING_IDEAS).toHaveLength(3);
    expect(RECOMMENDED_IDEAS).toHaveLength(3);
  });

  it("only use tags valid for idea cards", () => {
    for (const idea of [...TRENDING_IDEAS, ...RECOMMENDED_IDEAS]) {
      expect(VALID_TAGS, idea.id).toContain(idea.tag);
    }
  });

  it("only reference category chips that exist", () => {
    for (const idea of [...TRENDING_IDEAS, ...RECOMMENDED_IDEAS]) {
      expect(idea.categories.length, idea.id).toBeGreaterThan(0);
      for (const category of idea.categories) {
        expect(VALID_CATEGORIES, idea.id).toContain(category);
      }
    }
  });

  it("populate every display field", () => {
    for (const idea of [...TRENDING_IDEAS, ...RECOMMENDED_IDEAS]) {
      expect(idea.title, idea.id).toBeTruthy();
      expect(idea.description, idea.id).toBeTruthy();
      expect(idea.time, idea.id).toBeTruthy();
      expect(idea.impact, idea.id).toBeTruthy();
      expect(idea.artKey, idea.id).toBeTruthy();
    }
  });
});

describe("filterIdeasByCategory", () => {
  const ideas = [
    makeIdea({ id: "a", categories: ["Plastic"] }),
    makeIdea({ id: "b", categories: ["Glass", "Cardboard"] }),
    makeIdea({ id: "c", categories: ["Plastic", "Textile"] }),
  ];

  it("returns everything for All", () => {
    expect(filterIdeasByCategory(ideas, "All")).toEqual(ideas);
  });

  it("keeps ideas tagged with the chosen category", () => {
    expect(filterIdeasByCategory(ideas, "Plastic").map((i) => i.id)).toEqual([
      "a",
      "c",
    ]);
  });

  it("returns nothing when no idea matches", () => {
    expect(filterIdeasByCategory(ideas, "Organic")).toEqual([]);
  });

  it("does not mutate the input array", () => {
    const copy = [...ideas];
    filterIdeasByCategory(ideas, "Glass");
    expect(ideas).toEqual(copy);
  });
});
