import { describe, expect, it } from "vitest";
import {
  distanceKm,
  filterListings,
  type ExchangeFilterState,
} from "./exchange-filters";
import type { ExchangeListing } from "@/constants/exchange";

function makeListing(
  overrides: Partial<ExchangeListing> = {},
): ExchangeListing {
  return {
    id: "test-listing",
    title: "Glass jars (various sizes)",
    meta: "10 pieces • Good condition",
    tag: "Free",
    distance: "1.2 km",
    district: "Rubavu",
    postedBy: "Amina K.",
    material: "Glass",
    condition: "Good",
    ...overrides,
  };
}

const listings: ExchangeListing[] = [
  makeListing(),
  makeListing({
    id: "cardboard",
    title: "Cardboard boxes",
    meta: "5 boxes • Good condition",
    tag: "Exchange",
    distance: "2.4 km",
    district: "Gisenyi",
    postedBy: "James T.",
    material: "Paper",
    condition: "Good",
  }),
  makeListing({
    id: "clothes",
    title: "Used clothes",
    meta: "10 items • Fair condition",
    tag: "Sale",
    distance: "3.6 km",
    district: "Rubavu",
    postedBy: "Sarah B.",
    material: "Textile",
    condition: "Fair",
  }),
];

const allFilters: ExchangeFilterState = {
  query: "",
  typeFilter: "All",
  materialFilter: "All",
  conditionFilter: "All",
  sortByDistance: false,
};

describe("distanceKm", () => {
  it("parses the km value from a display string", () => {
    expect(distanceKm(makeListing({ distance: "2.4 km" }))).toBeCloseTo(2.4);
    expect(distanceKm(makeListing({ distance: "10 km" }))).toBe(10);
  });

  it("returns NaN for a string without a number", () => {
    expect(distanceKm(makeListing({ distance: "nearby" }))).toBeNaN();
  });
});

describe("filterListings", () => {
  it("returns everything unchanged when no filters are active", () => {
    expect(filterListings(listings, allFilters)).toEqual(listings);
  });

  it("does not mutate or reorder the input array", () => {
    const copy = [...listings];
    filterListings(listings, { ...allFilters, sortByDistance: true });
    expect(listings).toEqual(copy);
  });

  it("filters by listing type (tag)", () => {
    const result = filterListings(listings, {
      ...allFilters,
      typeFilter: "Sale",
    });
    expect(result.map((l) => l.id)).toEqual(["clothes"]);
  });

  it("filters by material", () => {
    const result = filterListings(listings, {
      ...allFilters,
      materialFilter: "Glass",
    });
    expect(result.map((l) => l.id)).toEqual(["test-listing"]);
  });

  it("filters by condition", () => {
    const result = filterListings(listings, {
      ...allFilters,
      conditionFilter: "Fair",
    });
    expect(result.map((l) => l.id)).toEqual(["clothes"]);
  });

  it("combines multiple filter axes with AND semantics", () => {
    const result = filterListings(listings, {
      ...allFilters,
      typeFilter: "Exchange",
      materialFilter: "Paper",
    });
    expect(result.map((l) => l.id)).toEqual(["cardboard"]);
  });

  it("returns nothing when filters exclude every listing", () => {
    const result = filterListings(listings, {
      ...allFilters,
      typeFilter: "Sale",
      materialFilter: "Glass",
    });
    expect(result).toEqual([]);
  });

  describe("query search", () => {
    it("matches case-insensitively against the title", () => {
      const result = filterListings(listings, {
        ...allFilters,
        query: "GLASS",
      });
      expect(result.map((l) => l.id)).toEqual(["test-listing"]);
    });

    it("matches the material field", () => {
      const result = filterListings(listings, {
        ...allFilters,
        query: "textile",
      });
      expect(result.map((l) => l.id)).toEqual(["clothes"]);
    });

    it("matches the district field", () => {
      const result = filterListings(listings, {
        ...allFilters,
        query: "gisenyi",
      });
      expect(result.map((l) => l.id)).toEqual(["cardboard"]);
    });

    it("matches the poster name", () => {
      const result = filterListings(listings, {
        ...allFilters,
        query: "james",
      });
      expect(result.map((l) => l.id)).toEqual(["cardboard"]);
    });

    it("ignores whitespace-only queries", () => {
      expect(filterListings(listings, { ...allFilters, query: "   " })).toEqual(
        listings,
      );
    });

    it("trims the query", () => {
      const result = filterListings(listings, {
        ...allFilters,
        query: "  glass  ",
      });
      expect(result).toHaveLength(1);
    });

    it("returns nothing when the query matches no listing", () => {
      expect(
        filterListings(listings, { ...allFilters, query: "smartphone" }),
      ).toEqual([]);
    });

    it("combines query with structural filters", () => {
      const result = filterListings(listings, {
        ...allFilters,
        query: "boxes",
        typeFilter: "Exchange",
      });
      expect(result.map((l) => l.id)).toEqual(["cardboard"]);
    });
  });

  describe("distance sort", () => {
    it("sorts ascending by distance", () => {
      const result = filterListings(listings, {
        ...allFilters,
        sortByDistance: true,
      });
      expect(result.map((l) => l.id)).toEqual([
        "test-listing",
        "cardboard",
        "clothes",
      ]);
    });

    it("keeps insertion order when sort is off", () => {
      const result = filterListings(listings, allFilters);
      expect(result.map((l) => l.id)).toEqual([
        "test-listing",
        "cardboard",
        "clothes",
      ]);
    });
  });
});
