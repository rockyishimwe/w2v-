import { describe, expect, it } from "vitest";
import {
  ACTIVITY_BANNER,
  ACTIVITY_FILTERS,
  ACTIVITY_QUICK_ACTIONS,
} from "./activity";

describe("activity UI constants", () => {
  it("has the design's five filter chips in order", () => {
    expect(ACTIVITY_FILTERS).toEqual([
      "All",
      "Recycling",
      "Reuse",
      "Exchange",
      "Scan",
    ]);
  });

  it("has complete banner copy", () => {
    expect(ACTIVITY_BANNER.title).toBeTruthy();
    expect(ACTIVITY_BANNER.body).toBeTruthy();
  });

  it("links quick actions to real routes", () => {
    expect(ACTIVITY_QUICK_ACTIONS).toHaveLength(3);
    for (const action of ACTIVITY_QUICK_ACTIONS) {
      expect(action.title).toBeTruthy();
      expect(action.sub).toBeTruthy();
      expect(action.href).toMatch(/^\//);
    }
  });
});
