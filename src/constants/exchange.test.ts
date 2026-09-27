import { describe, expect, it } from "vitest";
import {
  ALL_ITEMS,
  AREA_ITEMS_LIMIT,
  AREA_LISTINGS,
  CONDITION_FILTERS,
  FEATURED_LISTING,
  getExchangeItemDetail,
  LISTINGS,
  MATERIAL_FILTERS,
  POPULAR_CATEGORIES,
  TYPE_FILTERS,
  type ConditionFilter,
  type ListingTag,
  type MaterialFilter,
} from "./exchange";

const VALID_TAGS: ListingTag[] = ["Free", "Exchange", "Sale"];
const VALID_MATERIALS: MaterialFilter[] = [
  "Organic",
  "Paper",
  "Plastic",
  "Glass",
  "Metal",
  "Wood",
  "Textile",
  "Electronics",
];
const VALID_CONDITIONS: ConditionFilter[] = ["New", "Good", "Fair"];

describe("exchange listings data", () => {
  it("has unique listing IDs", () => {
    const ids = LISTINGS.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("uses only valid tags, materials and conditions", () => {
    for (const listing of LISTINGS) {
      expect(VALID_TAGS, listing.id).toContain(listing.tag);
      expect(VALID_MATERIALS, listing.id).toContain(listing.material);
      expect(VALID_CONDITIONS, listing.id).toContain(listing.condition);
    }
  });

  it("stores machine-readable distance values", () => {
    for (const listing of LISTINGS) {
      expect(
        Number.isNaN(Number.parseFloat(listing.distance)),
        listing.id,
      ).toBe(false);
    }
  });

  it("populates every display field of every listing", () => {
    for (const listing of LISTINGS) {
      expect(listing.title, listing.id).toBeTruthy();
      expect(listing.meta, listing.id).toBeTruthy();
      expect(listing.district, listing.id).toBeTruthy();
      expect(listing.postedBy, listing.id).toBeTruthy();
    }
  });

  it("exports a filter entry for every material type", () => {
    expect([...MATERIAL_FILTERS].sort()).toEqual([...VALID_MATERIALS].sort());
  });

  it("exports filter entries for every tag and condition", () => {
    expect([...TYPE_FILTERS].sort()).toEqual([...VALID_TAGS].sort());
    expect([...CONDITION_FILTERS].sort()).toEqual([...VALID_CONDITIONS].sort());
  });
});

describe("featured listing", () => {
  it("is well-formed", () => {
    expect(FEATURED_LISTING.title).toBeTruthy();
    expect(VALID_TAGS).toContain(FEATURED_LISTING.tag);
    expect(VALID_MATERIALS).toContain(FEATURED_LISTING.material);
    expect(VALID_CONDITIONS).toContain(FEATURED_LISTING.condition);
  });

  it("is marked as featured", () => {
    expect(FEATURED_LISTING.featured).toBe(true);
  });
});

describe("popular categories", () => {
  it("are non-empty and unique", () => {
    const labels = POPULAR_CATEGORIES.map((c) => c.label);
    expect(labels.length).toBeGreaterThan(0);
    expect(new Set(labels).size).toBe(labels.length);
    for (const label of labels) {
      expect(label).toBeTruthy();
    }
  });

  it("include every material so category chips can filter", () => {
    // The Category popover maps "Paper/Cardboard" → "Paper"; every other
    // label must be a valid MaterialFilter directly.
    for (const { label } of POPULAR_CATEGORIES) {
      const material =
        label === "Paper/Cardboard" ? "Paper" : (label as MaterialFilter);
      expect(VALID_MATERIALS, label).toContain(material);
    }
  });
});

describe("area listings", () => {
  it("have ids unique across every item", () => {
    const ids = ALL_ITEMS.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("use only valid tags, materials and conditions", () => {
    for (const listing of AREA_LISTINGS) {
      expect(VALID_TAGS, listing.id).toContain(listing.tag);
      expect(VALID_MATERIALS, listing.id).toContain(listing.material);
      expect(VALID_CONDITIONS, listing.id).toContain(listing.condition);
    }
  });
});

describe("getExchangeItemDetail", () => {
  it("resolves every item", () => {
    for (const { id } of ALL_ITEMS) {
      expect(getExchangeItemDetail(id), id).not.toBeNull();
    }
  });

  it("matches the listing card it was opened from", () => {
    for (const listing of ALL_ITEMS) {
      const detail = getExchangeItemDetail(listing.id);
      expect(detail?.title, listing.id).toBe(listing.title);
      expect(detail?.tag, listing.id).toBe(listing.tag);
      expect(detail?.poster.name, listing.id).toBe(listing.postedBy);
      expect(detail?.pickupPoint, listing.id).toBe(listing.district);
    }
  });

  it("keeps the designed Glass Jar copy on top of the listing data", () => {
    const detail = getExchangeItemDetail("glass-jars");
    expect(detail?.badge).toBe("Free Item");
    expect(detail?.statusNotes).toEqual([
      "Clean",
      "Reusable",
      "Good condition",
    ]);
    expect(detail?.gallery).toHaveLength(3);
  });

  it("gives other items their own single photo", () => {
    expect(getExchangeItemDetail("wooden-chair")?.gallery).toEqual([
      "wooden-chair",
    ]);
  });

  it("never repeats the material as the category", () => {
    for (const { id } of ALL_ITEMS) {
      const detail = getExchangeItemDetail(id);
      const category = detail?.attributes.find((a) => a.label === "Category");
      const material = detail?.attributes.find((a) => a.label === "Material");
      expect(category?.value, id).not.toBe(material?.value);
    }
  });

  it("only lists area items from the same district, never itself", () => {
    for (const listing of ALL_ITEMS) {
      const detail = getExchangeItemDetail(listing.id);
      expect(detail?.areaItems.length, listing.id).toBeLessThanOrEqual(
        AREA_ITEMS_LIMIT,
      );
      for (const item of detail?.areaItems ?? []) {
        expect(item.id, listing.id).not.toBe(listing.id);
        expect(item.location, listing.id).toBe(listing.district);
      }
    }
  });

  it("returns an empty area list for a district with no other items", () => {
    // "Used clothes" is the only Goma listing.
    expect(getExchangeItemDetail("used-clothes")?.areaItems).toEqual([]);
  });

  it("populates poster and exactly six detail rows", () => {
    for (const { id } of ALL_ITEMS) {
      const detail = getExchangeItemDetail(id);
      expect(detail?.poster.memberSince, id).toBeTruthy();
      expect(detail?.details, id).toHaveLength(6);
    }
  });

  it("returns null for unknown ids", () => {
    expect(getExchangeItemDetail("does-not-exist")).toBeNull();
  });
});
