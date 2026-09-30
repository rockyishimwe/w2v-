import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { isAllowed, resetRateLimits } from "./rate-limit";

describe("rate-limit", () => {
  beforeEach(() => resetRateLimits());

  afterEach(() => {
    vi.useRealTimers();
  });

  it("allows requests under the limit", () => {
    const options = { limit: 3, windowSeconds: 60 };
    expect(isAllowed("k", options)).toBe(true);
    expect(isAllowed("k", options)).toBe(true);
    expect(isAllowed("k", options)).toBe(true);
  });

  it("blocks requests beyond the limit", () => {
    const options = { limit: 2, windowSeconds: 60 };
    isAllowed("k", options);
    isAllowed("k", options);
    expect(isAllowed("k", options)).toBe(false);
  });

  it("resets after the window elapses", () => {
    vi.useFakeTimers();
    const start = Date.now();
    vi.setSystemTime(start);

    const options = { limit: 1, windowSeconds: 60 };
    expect(isAllowed("k", options)).toBe(true);
    expect(isAllowed("k", options)).toBe(false);

    vi.setSystemTime(start + 61_000);
    expect(isAllowed("k", options)).toBe(true);
  });

  it("tracks keys independently", () => {
    const options = { limit: 1, windowSeconds: 60 };
    expect(isAllowed("a", options)).toBe(true);
    expect(isAllowed("b", options)).toBe(true);
    expect(isAllowed("a", options)).toBe(false);
  });
});
