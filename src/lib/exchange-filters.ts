import type {
  ConditionFilter,
  ExchangeListing,
  ListingTag,
  MaterialFilter,
} from "@/constants/exchange";

/** All "All" state for one call site (the Exchange page). */
export type TypeFilter = ListingTag | "All";

/** Filter + sort state for the Exchange listings grid. */
export interface ExchangeFilterState {
  query: string;
  typeFilter: TypeFilter;
  materialFilter: MaterialFilter | "All";
  conditionFilter: ConditionFilter | "All";
  sortByDistance: boolean;
}

/** Distance in km parsed from the listing's display string ("2.4 km"). */
export function distanceKm(listing: ExchangeListing): number {
  return Number.parseFloat(listing.distance);
}

/**
 * Pure filtering + sorting for the Exchange marketplace.
 * Extracted from ExchangeClient so the rules are unit-testable;
 * behavior is identical to the previous inline implementation.
 */
export function filterListings(
  listings: ExchangeListing[],
  {
    query,
    typeFilter,
    materialFilter,
    conditionFilter,
    sortByDistance,
  }: ExchangeFilterState,
): ExchangeListing[] {
  let result = listings.filter((l) => {
    if (typeFilter !== "All" && l.tag !== typeFilter) return false;
    if (materialFilter !== "All" && l.material !== materialFilter) return false;
    if (conditionFilter !== "All" && l.condition !== conditionFilter)
      return false;
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      const haystack =
        `${l.title} ${l.material} ${l.district} ${l.postedBy}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
  if (sortByDistance) {
    result = [...result].sort((a, b) => distanceKm(a) - distanceKm(b));
  }
  return result;
}
