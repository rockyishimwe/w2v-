import { describe, expect, it } from "vitest";
import { DIY_GUIDE, SIMILAR_IDEAS } from "./diy-guide";

describe("DIY guide content", () => {
  it("has a complete guide payload", () => {
    expect(DIY_GUIDE.tag).toBe("DIY");
    expect(DIY_GUIDE.title).toBeTruthy();
    expect(DIY_GUIDE.intro).toBeTruthy();
    expect(DIY_GUIDE.timeNeeded).toBeTruthy();
    expect(DIY_GUIDE.difficulty).toBeTruthy();
    expect(DIY_GUIDE.impact).toBeTruthy();
    expect(DIY_GUIDE.estimatedCost).toBeTruthy();
  });

  it("lists at least one material with a note", () => {
    expect(DIY_GUIDE.materials.length).toBeGreaterThan(0);
    for (const material of DIY_GUIDE.materials) {
      expect(material.name).toBeTruthy();
      expect(material.note).toBeTruthy();
    }
  });

  it("provides ordered steps", () => {
    expect(DIY_GUIDE.steps.length).toBeGreaterThan(0);
    for (const step of DIY_GUIDE.steps) {
      expect(step.title).toBeTruthy();
      expect(step.description).toBeTruthy();
    }
  });
});

describe("similar ideas", () => {
  it("are non-empty and unique", () => {
    const titles = SIMILAR_IDEAS.map((i) => i.title);
    expect(titles.length).toBeGreaterThan(0);
    expect(new Set(titles).size).toBe(titles.length);
  });

  it("only use tags valid for the similar-ideas rail", () => {
    // DiySimilarIdea excludes Exchange / Recycle / Dispose safely.
    const validTags = ["DIY", "Reuse"];
    for (const idea of SIMILAR_IDEAS) {
      expect(validTags, idea.title).toContain(idea.tag);
      expect(idea.time).toBeTruthy();
      expect(idea.impact).toBeTruthy();
    }
  });
});
