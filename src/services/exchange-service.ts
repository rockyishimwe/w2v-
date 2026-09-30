/**
 * Exchange service layer — the only module UI components talk to for
 * marketplace data. All content comes from the real API; there is no
 * mock fallback. Network failures surface as rejected promises so pages
 * can render proper loading/error/empty states.
 */
import { api } from "@/lib/api-client";

export type ListingTag = "Free" | "Exchange" | "Sale";
export type MaterialFilter =
  | "Organic"
  | "Paper"
  | "Plastic"
  | "Glass"
  | "Metal"
  | "Wood"
  | "Textile"
  | "Electronics";
export type ConditionFilter = "New" | "Good" | "Fair";

/* Filter vocabularies (UI options, not content — the backend validates
   against the same enums). */
export const MATERIAL_FILTERS: MaterialFilter[] = [
  "Organic",
  "Paper",
  "Plastic",
  "Glass",
  "Metal",
  "Wood",
  "Textile",
  "Electronics",
];
export const CONDITION_FILTERS: ConditionFilter[] = ["New", "Good", "Fair"];
export const TYPE_FILTERS: ListingTag[] = ["Free", "Exchange", "Sale"];
export const POPULAR_CATEGORIES = [
  { label: "Organic" },
  { label: "Paper/Cardboard" },
  { label: "Plastic" },
  { label: "Glass" },
  { label: "Metal" },
  { label: "Textile" },
  { label: "Electronics" },
] as const;

/** Flat card shape rendered by the listings grid. */
export interface ExchangeListing {
  id: string;
  title: string;
  /** Meta line under the title, e.g. "10 pieces • Good condition". */
  meta: string;
  tag: ListingTag;
  distance: string;
  district: string;
  postedBy: string;
  material: MaterialFilter;
  category: string;
  condition: ConditionFilter;
  /** Uploaded photo URL, when the poster added one. */
  image?: string;
  featured?: boolean;
}

/** Poster card on the detail page (real counts, no invented ratings). */
export interface ExchangePoster {
  name: string;
  memberSince: string;
  exchanges: number;
  activeListings: number;
  location: string;
  distanceAway: string;
}

export interface ExchangeItemAttribute {
  label: string;
  value: string;
}

export interface ExchangeDetailRow {
  label: string;
  value: string;
}

export interface AreaExchangeItem {
  id: string;
  title: string;
  tag: ListingTag;
  location: string;
  image?: string;
}

/** Full payload for the exchange item detail page. */
export interface ExchangeItemDetail {
  id: string;
  tag: ListingTag;
  badge: string;
  title: string;
  statusNotes: string[];
  attributes: ExchangeItemAttribute[];
  description: string[];
  ecoNote: string;
  image: string | null;
  details: ExchangeDetailRow[];
  poster: ExchangePoster;
  pickupPoint: string;
  pickupNote: string;
  whyExchange: string;
  shareNote: string;
  areaItems: AreaExchangeItem[];
}

interface ListingsResponse {
  data: ExchangeListing[];
  page: number;
  pageSize: number;
  total: number;
}

export interface ListingQueryInput {
  query?: string;
  tag?: ListingTag | "All";
  material?: MaterialFilter | "All";
  condition?: ConditionFilter | "All";
  sortByDistance?: boolean;
}

/** GET /api/exchange/listings — server-side filtered + sorted. */
export async function fetchListings(
  filters: ListingQueryInput = {},
): Promise<ListingsResponse> {
  const params = new URLSearchParams();
  if (filters.query?.trim()) params.set("query", filters.query.trim());
  if (filters.tag && filters.tag !== "All") params.set("type", filters.tag);
  if (filters.material && filters.material !== "All") {
    params.set("material", filters.material);
  }
  if (filters.condition && filters.condition !== "All") {
    params.set("condition", filters.condition);
  }
  if (filters.sortByDistance) params.set("sort", "distance");
  const qs = params.toString();
  return api.get<ListingsResponse>(
    `/api/exchange/listings${qs ? `?${qs}` : ""}`,
  );
}

/** GET /api/exchange/listings/[id] — full detail payload. */
export function fetchListingDetail(id: string): Promise<ExchangeItemDetail> {
  return api.get<ExchangeItemDetail>(`/api/exchange/listings/${id}`);
}

/** POST /api/exchange/listings/[id] — express interest (auth required). */
export function expressInterest(
  id: string,
  message?: string,
): Promise<{ ok: boolean }> {
  return api.post<{ ok: boolean }>(`/api/exchange/listings/${id}`, {
    ...(message ? { message } : {}),
  });
}

/** POST /api/uploads — uploads a photo, returns its public path. */
export async function uploadImage(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  const response = await fetch("/api/uploads", {
    method: "POST",
    body: form,
  });
  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as {
      error?: { message?: string };
    } | null;
    throw new Error(payload?.error?.message ?? "Image upload failed.");
  }
  const saved = (await response.json()) as { path: string };
  return saved.path;
}

export interface CreateListingInput {
  title: string;
  meta: string;
  tag: ListingTag;
  district: string;
  distanceKm: number;
  material: MaterialFilter;
  category: string;
  condition: ConditionFilter;
  imagePath?: string;
}

/** POST /api/exchange/listings — create a listing (auth required). */
export function createListing(
  input: CreateListingInput,
): Promise<ExchangeListing> {
  return api.post<ExchangeListing>("/api/exchange/listings", input);
}
