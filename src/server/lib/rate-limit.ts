/**
 * In-memory sliding-window rate limiter keyed by (bucket, identifier).
 *
 * Good enough for an MVP on a single Node process; swap for Redis/Upstash
 * when the app scales beyond one instance. AI and auth endpoints use the
 * strict bucket, everything else the default one.
 */

interface BucketState {
  hits: number[];
}

const buckets = new Map<string, BucketState>();

// Periodically drop stale buckets so the map cannot grow unbounded.
const SWEEP_INTERVAL_MS = 5 * 60 * 1000;
let lastSweep = Date.now();

export interface RateLimitOptions {
  /** Max requests inside the window. */
  limit: number;
  /** Window length in seconds. */
  windowSeconds: number;
}

export const RATE_LIMITS = {
  auth: { limit: 10, windowSeconds: 60 },
  ai: { limit: 20, windowSeconds: 60 },
  default: { limit: 120, windowSeconds: 60 },
} as const satisfies Record<string, RateLimitOptions>;

/**
 * Returns true when the request is allowed. On allow, the hit is recorded;
 * on deny, nothing is recorded (so retries are not punished twice).
 */
export function isAllowed(key: string, options: RateLimitOptions): boolean {
  const now = Date.now();

  if (now - lastSweep > SWEEP_INTERVAL_MS) {
    for (const [bucketKey, state] of buckets) {
      const cutoff = now - Math.max(options.windowSeconds, 300) * 1000;
      state.hits = state.hits.filter((t) => t > cutoff);
      if (state.hits.length === 0) buckets.delete(bucketKey);
    }
    lastSweep = now;
  }

  const state = buckets.get(key) ?? { hits: [] };
  const windowStart = now - options.windowSeconds * 1000;
  state.hits = state.hits.filter((t) => t > windowStart);

  if (state.hits.length >= options.limit) {
    buckets.set(key, state);
    return false;
  }

  state.hits.push(now);
  buckets.set(key, state);
  return true;
}

/** Clears all buckets (used by tests). */
export function resetRateLimits(): void {
  buckets.clear();
}
