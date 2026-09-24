import type { ScanResult } from "@/types";

/**
 * Scanner service layer.
 *
 * The component tree only ever talks to these functions, so when the real
 * backend lands (SRS: token-based auth against a REST API) the swap happens
 * here without touching UI code. Current implementation returns the design
 * mock immediately.
 */

export async function analyzeImage(_photoDataUrl: string): Promise<ScanResult> {
  void _photoDataUrl; // will be POSTed to the analysis endpoint
  return getMockScanResult();
}

export function getMockScanResult(): ScanResult {
  return {
    id: "mock-glass-jar",
    title: "Glass jar",
    material: "Glass",
    category: "Container",
    confidence: 92,
    detectedSummary: "1 glass jar (approx. 500 ml)",
    condition: "Good",
    estimatedSize: "500 ml",
    tip: {
      title: "Great find!",
      body: "Glass is valuable and can be reused many times.",
    },
    recommendations: [
      { category: "Reuse", description: "Use it for storage or decoration" },
      { category: "DIY", description: "Turn it into a planter or lamp" },
      {
        category: "Exchange",
        description: "Give or find someone who needs it",
      },
      {
        category: "Recycle",
        description: "If not reusable, recycle at a collection point",
      },
      {
        category: "Dispose safely",
        description: "Use proper waste bin if needed",
      },
    ],
  };
}
