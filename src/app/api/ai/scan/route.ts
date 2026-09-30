import { NextRequest } from "next/server";
import {
  errorResponse,
  jsonResponse,
  optionsResponse,
  parseJsonBody,
  resolveLocale,
} from "@/server/lib/http";
import { rateLimited } from "@/server/lib/errors";
import { RATE_LIMITS, isAllowed } from "@/server/lib/rate-limit";
import { requireAuth } from "@/server/lib/auth";
import { findReplay, recordResponse } from "@/server/lib/idempotency";
import { aiScanSchema } from "@/server/schemas";
import { analyzeWastePhoto } from "@/server/services/ai-service";
import { prisma } from "@/server/lib/prisma";
import { logger } from "@/server/lib/logger";

export async function OPTIONS(request: NextRequest) {
  return optionsResponse(request);
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
    if (!isAllowed(`ai:${auth.id}:${ip}`, RATE_LIMITS.ai)) {
      throw rateLimited();
    }

    const body = await parseJsonBody(request, aiScanSchema);
    const locale = resolveLocale(request, body.locale);

    // Idempotency for offline-queued scans.
    const idempotencyKey = request.headers.get("idempotency-key");
    const replay = findReplay(idempotencyKey, "POST /api/ai/scan", body.image);
    if (replay) {
      return jsonResponse(request, replay.body, { status: replay.status });
    }

    const result = await analyzeWastePhoto(body.image, locale);

    // Persist the scan (never the image itself — keep payloads small).
    const scan = await prisma.scan.create({
      data: {
        userId: auth.id,
        title: result.title,
        material: result.material,
        category: result.category,
        confidence: Math.round(result.confidence),
        detectedSummary: result.detectedSummary,
        condition: result.condition,
        estimatedSize: result.estimatedSize,
        tipTitle: result.tip.title,
        tipBody: result.tip.body,
        recommendations: result.recommendations,
      },
    });

    // A scan is also an activity feed entry.
    await prisma.activityEntry.create({
      data: {
        userId: auth.id,
        type: "Scan",
        title: `Scanned ${result.title.toLowerCase()}`,
        description: `You scanned an item. ${result.detectedSummary}`,
        location: "Home",
        artKey: "glass-jar",
      },
    });

    const payload = {
      id: scan.id,
      title: result.title,
      material: result.material,
      category: result.category,
      confidence: Math.round(result.confidence),
      detectedSummary: result.detectedSummary,
      condition: result.condition,
      estimatedSize: result.estimatedSize,
      tip: result.tip,
      recommendations: result.recommendations,
    };

    recordResponse(
      idempotencyKey,
      "POST /api/ai/scan",
      body.image,
      payload,
      201,
    );
    logger.info("scan analyzed", { userId: auth.id, source: result.source });

    return jsonResponse(request, payload, { status: 201 });
  } catch (error) {
    return errorResponse(request, error);
  }
}
