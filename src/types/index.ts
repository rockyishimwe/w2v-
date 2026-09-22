/**
 * Shared TypeScript types for the Waste2Value frontend.
 * These describe the shapes the backend API is expected to return
 * (see SRS notes in README: REST + JSON over HTTPS).
 */

/** Outcome categories the AI scanner can recommend. */
export type OutcomeCategory =
  "Reuse" | "DIY" | "Exchange" | "Recycle" | "Dispose safely";

/** One suggestion attached to a scan result. */
export interface ScanRecommendation {
  category: OutcomeCategory;
  description: string;
}

/** Analysis payload returned by the AI scanner service. */
export interface ScanResult {
  id: string;
  title: string;
  material: string;
  category: string;
  /** 0-100 AI confidence. */
  confidence: number;
  detectedSummary: string;
  condition: string;
  estimatedSize: string;
  tip: { title: string; body: string };
  recommendations: ScanRecommendation[];
}

/** Activity feed entry on the dashboard. */
export interface ActivityItem {
  id: string;
  item: string;
  outcome: string;
  meta: string;
}

/** Nearby exchange opportunity card on the dashboard. */
export interface ExchangeOpportunity {
  id: string;
  title: string;
  meta: string;
  tag: "Free" | "Exchange";
}
