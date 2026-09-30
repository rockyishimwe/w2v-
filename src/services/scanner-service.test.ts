import { afterEach, describe, expect, it, vi } from "vitest";
import { analyzeImage } from "./scanner-service";
import type { ScanResult } from "@/types";

function makeServerResult(): ScanResult {
  return {
    id: "scan-123",
    title: "Cardboard box",
    material: "Paper",
    category: "Packaging",
    confidence: 91,
    detectedSummary: "1 cardboard box",
    condition: "Good",
    estimatedSize: "40 x 30 cm",
    tip: { title: "Good condition", body: "Reusable as storage." },
    recommendations: [
      { category: "Reuse", description: "Use for storage" },
      { category: "DIY", description: "Make a desk organizer" },
      { category: "Recycle", description: "Recycle at a drop-off point" },
    ],
  };
}

describe("analyzeImage", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("posts the photo to /api/ai/scan and returns the server payload", async () => {
    const serverResult = makeServerResult();
    const fetchMock = vi.fn(() =>
      Promise.resolve(
        new Response(JSON.stringify(serverResult), {
          status: 201,
          headers: { "Content-Type": "application/json" },
        }),
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    const result = await analyzeImage("data:image/jpeg;base64,abc123");
    expect(result).toEqual(serverResult);

    const [url, init] = fetchMock.mock.calls[0] as unknown as [
      string,
      RequestInit,
    ];
    expect(url).toBe("/api/ai/scan");
    expect(init.method).toBe("POST");
    expect(String(init.body)).toContain("data:image/jpeg;base64,abc123");
  });

  it("throws ApiClientError when the server rejects the scan", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve(
          new Response(
            JSON.stringify({
              error: {
                code: "VALIDATION_ERROR",
                message: "Invalid request body.",
              },
            }),
            { status: 422, headers: { "Content-Type": "application/json" } },
          ),
        ),
      ),
    );

    await expect(
      analyzeImage("data:image/jpeg;base64,abc123"),
    ).rejects.toMatchObject({ code: "VALIDATION_ERROR", status: 422 });
  });

  it("propagates network failures (UI renders the error state)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.reject(new TypeError("Failed to fetch"))),
    );

    await expect(
      analyzeImage("data:image/jpeg;base64,abc123"),
    ).rejects.toBeInstanceOf(TypeError);
  });
});
