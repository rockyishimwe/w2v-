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
import { createListingSchema } from "@/server/schemas";
import {
  createListing,
  listListings,
} from "@/server/repositories/exchange-repository";
import { createHash } from "node:crypto";

export async function OPTIONS(request: NextRequest) {
  return optionsResponse(request);
}

/**
 * GET /api/exchange/listings
 *   ?query=&type=Free|Exchange|Sale&material=Glass&condition=Good
 *   &sort=distance&featured=1&district=&page=1&pageSize=50
 */
export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;

    const result = await listListings({
      query: params.get("query")?.trim() || undefined,
      tag: params.get("type") || undefined,
      material: params.get("material") || undefined,
      condition: params.get("condition") || undefined,
      sortByDistance: params.get("sort") === "distance",
      featured:
        params.get("featured") === "1"
          ? true
          : params.get("featured") === "0"
            ? false
            : undefined,
      district: params.get("district") || undefined,
      page: Number(params.get("page") ?? 1),
      pageSize: Number(params.get("pageSize") ?? 50),
    });

    const etag = `W/"${createHash("sha1").update(JSON.stringify(result)).digest("base64url")}"`;
    if (request.headers.get("if-none-match") === etag) {
      return new NextResponse(null, { status: 304, headers: { ETag: etag } });
    }

    return jsonResponse(request, result, { headers: { ETag: etag } });
  } catch (error) {
    return errorResponse(request, error);
  }
}

/** POST /api/exchange/listings — create a listing (auth required). */
export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (!isAllowed(`exchange:${auth.id}`, RATE_LIMITS.default)) {
      throw rateLimited();
    }

    const body = await parseJsonBody(request, createListingSchema);
    const idempotencyKey = request.headers.get("idempotency-key");
    const replay = await findReplay(
      idempotencyKey,
      "POST /api/exchange/listings",
      body,
    );
    if (replay) {
      return jsonResponse(request, replay.body, { status: replay.status });
    }

    const postedByName = `${auth.firstName} ${auth.lastName}`.trim();
    const listing = await createListing(auth.id, postedByName, body);

    await recordResponse(
      idempotencyKey,
      "POST /api/exchange/listings",
      body,
      listing,
      201,
      auth.id,
    );
    return jsonResponse(request, listing, { status: 201 });
  } catch (error) {
    return errorResponse(request, error);
  }
}
