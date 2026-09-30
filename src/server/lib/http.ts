/**
 * Route-handler helpers: JSON responses, body parsing with size limits,
 * locale negotiation, security headers, and the central error handler that
 * produces the consistent { error: { code, message, details? } } shape.
 */
import { NextRequest, NextResponse } from "next/server";
import { ZodError, type ZodType } from "zod";
import { ApiError, payloadTooLarge } from "./errors";
import { logger } from "./logger";

/** Security headers applied to every API response. */
const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(self), microphone=(), geolocation=(self)",
};

/** Origins allowed by CORS (env-configurable; defaults to same-origin). */
function allowedOrigins(): string[] {
  const raw = process.env.ALLOWED_ORIGINS ?? "";
  return raw
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function corsHeaders(request: NextRequest): Record<string, string> {
  const origins = allowedOrigins();
  const origin = request.headers.get("origin");
  const headers: Record<string, string> = { ...SECURITY_HEADERS };

  if (origin && (origins.includes(origin) || origins.includes("*"))) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Access-Control-Allow-Methods"] = "GET,POST,OPTIONS";
    headers["Access-Control-Allow-Headers"] =
      "Content-Type, Authorization, Accept-Language, Idempotency-Key, If-None-Match";
    headers["Access-Control-Max-Age"] = "86400";
  }
  return headers;
}

/** Wraps a JSON payload with security/CORS headers and caching. */
export function jsonResponse(
  request: NextRequest,
  body: unknown,
  init: { status?: number; headers?: Record<string, string> } = {},
): NextResponse {
  return NextResponse.json(body, {
    status: init.status ?? 200,
    headers: {
      ...corsHeaders(request),
      "Cache-Control": "no-store",
      ...init.headers,
    },
  });
}

/** Handles CORS preflight for API routes. */
export function optionsResponse(request: NextRequest): NextResponse {
  return new NextResponse(null, { status: 204, headers: corsHeaders(request) });
}

/** Central error handler — converts anything thrown into the error shape. */
export function errorResponse(
  request: NextRequest,
  error: unknown,
): NextResponse {
  if (error instanceof ApiError) {
    if (error.status >= 500) {
      logger.error("api error", {
        path: request.nextUrl.pathname,
        code: error.code,
        message: error.message,
      });
    } else {
      logger.info("api handled error", {
        path: request.nextUrl.pathname,
        code: error.code,
      });
    }
    return jsonResponse(
      request,
      {
        error: {
          code: error.code,
          message: error.message,
          ...(error.details !== undefined ? { details: error.details } : {}),
        },
      },
      { status: error.status },
    );
  }

  logger.error("api unexpected error", {
    path: request.nextUrl.pathname,
    message: error instanceof Error ? error.message : String(error),
  });
  return jsonResponse(
    request,
    {
      error: {
        code: "INTERNAL_ERROR",
        message: "Something went wrong. Please try again.",
      },
    },
    { status: 500 },
  );
}

/** Parses and validates a JSON body with a strict size cap. */
export async function parseJsonBody<T>(
  request: NextRequest,
  schema: ZodType<T>,
  maxBytes = 1_500_000, // ~1.5 MB — scan payloads are downscaled JPEGs
): Promise<T> {
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > maxBytes) {
    throw payloadTooLarge();
  }

  let raw: unknown;
  try {
    const text = await request.text();
    if (text.length > maxBytes) {
      throw payloadTooLarge();
    }
    raw = JSON.parse(text);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(400, "BAD_REQUEST", "Invalid JSON body.");
  }

  const result = schema.safeParse(raw);
  if (!result.success) {
    throw new ApiError(422, "VALIDATION_ERROR", "Invalid request body.", {
      issues: result.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    });
  }
  return result.data;
}

export type Locale = "en" | "fr";
const SUPPORTED_LOCALES: Locale[] = ["en", "fr"];

/**
 * Resolves the user's locale from an explicit query/body param, then the
 * Accept-Language header, defaulting to English.
 */
export function resolveLocale(
  request: NextRequest,
  explicit?: string | null,
): Locale {
  const candidate = (explicit ?? "").trim().toLowerCase();
  if (SUPPORTED_LOCALES.includes(candidate as Locale)) {
    return candidate as Locale;
  }
  const header = request.headers.get("accept-language") ?? "";
  for (const part of header.split(",")) {
    const tag = part.split(";")[0]?.trim().toLowerCase() ?? "";
    if (SUPPORTED_LOCALES.includes(tag as Locale)) return tag as Locale;
    if (tag.startsWith("fr")) return "fr";
  }
  return "en";
}

/** Extracts the bearer token from the Authorization header, if any. */
export function bearerToken(request: NextRequest): string | null {
  const header = request.headers.get("authorization") ?? "";
  const match = /^Bearer\s+(.+)$/i.exec(header);
  return match ? match[1] : null;
}

export { ZodError };
