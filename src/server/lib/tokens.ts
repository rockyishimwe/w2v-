/**
 * JWT issuing/verification (jose) + refresh-token hashing and rotation.
 *
 * Access tokens are short-lived JWTs (default 15 min) signed with
 * JWT_SECRET. Refresh tokens are opaque random strings delivered to the
 * client; only their SHA-256 hash is stored, and each is rotated on use.
 */
import { SignJWT, jwtVerify } from "jose";
import { createHash, randomBytes } from "node:crypto";

export const ACCESS_TOKEN_TTL_SECONDS = 15 * 60; // 15 minutes
export const REFRESH_TOKEN_TTL_DAYS = 30;

export interface AccessTokenPayload {
  sub: string; // user id
  email: string;
  firstName: string;
  lastName: string;
  locale: string;
}

function accessSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "JWT_SECRET is missing or too short (min 16 chars). Set it in .env.local.",
    );
  }
  return new TextEncoder().encode(secret);
}

/** Issues a short-lived access JWT for the given user. */
export async function signAccessToken(
  payload: AccessTokenPayload,
): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer("waste2value")
    .setAudience("waste2value-client")
    .setExpirationTime(`${ACCESS_TOKEN_TTL_SECONDS}s`)
    .sign(accessSecret());
}

/** Verifies an access JWT; returns the payload or null when invalid/expired. */
export async function verifyAccessToken(
  token: string,
): Promise<AccessTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, accessSecret(), {
      issuer: "waste2value",
      audience: "waste2value-client",
    });
    if (typeof payload.sub !== "string") return null;
    return {
      sub: payload.sub,
      email: String(payload.email ?? ""),
      firstName: String(payload.firstName ?? ""),
      lastName: String(payload.lastName ?? ""),
      locale: String(payload.locale ?? "en"),
    };
  } catch {
    return null;
  }
}

/** Generates a new opaque refresh token (returned to the client once). */
export function generateRefreshToken(): string {
  return randomBytes(48).toString("base64url");
}

/** SHA-256 hash used to store refresh tokens (never store the raw token). */
export function hashRefreshToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
