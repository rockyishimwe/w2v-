import { describe, expect, it } from "vitest";
import { analyzeImage, getMockScanResult } from "./scanner-service";
import type { OutcomeCategory, ScanResult } from "@/types";

const VALID_CATEGORIES: OutcomeCategory[] = [
  "Reuse",
  "DIY",
  "Exchange",
  "Recycle",
  "Dispose safely",
];

describe("getMockScanResult", () => {
  it("returns a complete ScanResult shape", () => {
    const result: ScanResult = getMockScanResult();

    expect(result.id).toBeTruthy();
    expect(result.title).toBeTruthy();
    expect(result.material).toBeTruthy();
    expect(result.category).toBeTruthy();
    expect(result.detectedSummary).toBeTruthy();
    expect(result.condition).toBeTruthy();
    expect(result.estimatedSize).toBeTruthy();

    expect(result.tip.title).toBeTruthy();
    expect(result.tip.body).toBeTruthy();
    expect(result.recommendations.length).toBeGreaterThan(0);
  });

  it("keeps confidence within the documented 0-100 range", () => {
    const { confidence } = getMockScanResult();
    expect(confidence).toBeGreaterThanOrEqual(0);
    expect(confidence).toBeLessThanOrEqual(100);
  });

  it("only uses known outcome categories in recommendations", () => {
    const { recommendations } = getMockScanResult();
    for (const rec of recommendations) {
      expect(VALID_CATEGORIES).toContain(rec.category);
      expect(rec.description).toBeTruthy();
    }
  });
});

describe("analyzeImage", () => {
  it("resolves to the mock result regardless of the photo payload", async () => {
    const fromAnalyze = await analyzeImage("data:image/jpeg;base64,abc123");
    expect(fromAnalyze).toEqual(getMockScanResult());
  });

  it("resolves even for an empty data URL", async () => {
    await expect(analyzeImage("")).resolves.toBeInstanceOf(Object);
  });
});
