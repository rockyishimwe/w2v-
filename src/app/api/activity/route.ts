import { NextRequest, NextResponse } from "next/server";
import {
  errorResponse,
  jsonResponse,
  optionsResponse,
  parseJsonBody,
} from "@/server/lib/http";
import { rateLimited } from "@/server/lib/errors";
import { RATE_LIMITS, isAllowed } from "@/server/lib/rate-limit";
import { requireAuth } from "@/server/lib/auth";
import { findReplay, recordResponse } from "@/server/lib/idempotency";
import { activityFilterSchema, createActivitySchema } from "@/server/schemas";
import {
  computeImpact,
  computeStats,
  createEntry,
  listEntries,
} from "@/server/repositories/activity-repository";
import { createHash } from "node:crypto";

export async function OPTIONS(request: NextRequest) {
  return optionsResponse(request);
}

/** GET /api/activity?filter=All|Recycling|Reuse|Exchange|Scan&days=30&page=1 */
export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request);

    const url = request.nextUrl;
    const filterParsed = activityFilterSchema.safeParse(
      url.searchParams.get("filter") ?? "All",
    );
    const filter = filterParsed.success ? filterParsed.data : "All";
    const days = Math.min(
      365,
      Math.max(1, Number(url.searchParams.get("days") ?? 30)),
    );
    const page = Math.max(1, Number(url.searchParams.get("page") ?? 1));
    const pageSize = Math.min(
      100,
      Math.max(1, Number(url.searchParams.get("pageSize") ?? 50)),
    );

    const [feed, stats, impact] = await Promise.all([
      listEntries(auth.id, { filter, days, page, pageSize }),
      computeStats(auth.id, days),
      computeImpact(auth.id, days),
    ]);

    // ETag on the exact payload for conditional GET (low-bandwidth win).
    const payload = { ...feed, stats, impact };
    const etag = `W/"${createHash("sha1").update(JSON.stringify(payload)).digest("base64url")}"`;
    if (request.headers.get("if-none-match") === etag) {
      const headers = new Headers({ ETag: etag });
      return new NextResponse(null, { status: 304, headers });
    }

    return jsonResponse(request, payload, { headers: { ETag: etag } });
  } catch (error) {
    return errorResponse(request, error);
  }
}

/** POST /api/activity — records a manual entry (reuse/exchange/recycling). */
export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (!isAllowed(`activity:${auth.id}`, RATE_LIMITS.default)) {
      throw rateLimited();
    }

    const body = await parseJsonBody(request, createActivitySchema);
    const idempotencyKey = request.headers.get("idempotency-key");
    const replay = await findReplay(idempotencyKey, "POST /api/activity", body);
    if (replay) {
      return jsonResponse(request, replay.body, { status: replay.status });
    }

    const entry = await createEntry({
      userId: auth.id,
      type: body.type,
      title: body.title,
      description: body.description,
      location: body.location,
      artKey: body.artKey,
      wasteKg: body.wasteKg,
      occurredAt: body.occurredAt ? new Date(body.occurredAt) : undefined,
    });

    await recordResponse(
      idempotencyKey,
      "POST /api/activity",
      body,
      entry,
      201,
      auth.id,
    );
    return jsonResponse(request, entry, { status: 201 });
  } catch (error) {
    return errorResponse(request, error);
  }
}
