/**
 * Central password hashing helpers.
 *
 * Uses bcryptjs (pure JS — no native build issues on Windows CI) with 10
 * salt rounds, the standard choice for an MVP with modest traffic.
 */
import bcrypt from "bcryptjs";

const BCRYPT_ROUNDS = 10;

/** Hash a plaintext password for storage. */
export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, BCRYPT_ROUNDS);
}

/** Verify a plaintext password against a stored hash. */
export async function verifyPassword(
  plain: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}
