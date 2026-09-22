import { describe, expect, it } from "vitest";
import { PHOTO_KEY, loadPhoto } from "./photo";

describe("loadPhoto", () => {
  it("returns null outside the browser (no window)", async () => {
    // Photo state must stay client-side (low-bandwidth SRS constraint), so
    // SSR has to be safe. Vitest node env has no window.
    expect(globalThis.window).toBeUndefined();
    expect(loadPhoto()).toBeNull();
  });
});

describe("PHOTO_KEY", () => {
  it("is the stable sessionStorage hand-off key", () => {
    expect(PHOTO_KEY).toBe("w2v-scanner-capture");
  });
});
