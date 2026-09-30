import type { ScanResult } from "@/types";
import { api } from "@/lib/api-client";

/**
 * Scanner service layer.
 *
 * The component tree only ever talks to these functions. analyzeImage
 * calls the real backend (POST /api/ai/scan — Groq vision model) and
 * surfaces errors to the UI, which renders loading/error states. All
 * results are real AI output; there is no mock result anymore.
 */
export async function analyzeImage(photoDataUrl: string): Promise<ScanResult> {
  return api.post<ScanResult>("/api/ai/scan", {
    image: photoDataUrl,
  });
}
