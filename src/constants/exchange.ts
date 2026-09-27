/**
 * Exchange marketplace data — matches the approved design.
 * Swap for the real API via the service layer later; UI consumes types only.
 */

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
  /** What the item is (Container, Furniture…), distinct from its material. */
  category: string;
  condition: ConditionFilter;
  featured?: boolean;
}

export interface ExchangeCategory {
  label: string;
}

export const LISTINGS: ExchangeListing[] = [
  {
    id: "glass-jars",
    title: "Glass jars (various sizes)",
    meta: "10 pieces • Good condition",
    tag: "Free",
    distance: "1.2 km",
    district: "Rubavu",
    postedBy: "Amina K.",
    material: "Glass",
    category: "Container",
    condition: "Good",
  },
  {
    id: "cardboard-boxes",
    title: "Cardboard boxes",
    meta: "5 boxes • Good condition",
    tag: "Exchange",
    distance: "2.4 km",
    district: "Rubavu",
    postedBy: "James T.",
    material: "Paper",
    category: "Packaging",
    condition: "Good",
  },
  {
    id: "plastic-containers",
    title: "Plastic containers",
    meta: "12 pieces • Fair condition",
    tag: "Free",
    distance: "3.1 km",
    district: "Gisenyi",
    postedBy: "Grace N.",
    material: "Plastic",
    category: "Container",
    condition: "Fair",
  },
  {
    id: "wooden-chair",
    title: "Wooden chair",
    meta: "1 piece • Good condition",
    tag: "Sale",
    distance: "4.8 km",
    district: "Rubavu",
    postedBy: "Patrick M.",
    material: "Wood",
    category: "Furniture",
    condition: "Good",
  },
  {
    id: "organic-vegetables",
    title: "Organic vegetables",
    meta: "5 kg • Fresh",
    tag: "Exchange",
    distance: "2.0 km",
    district: "Rubavu",
    postedBy: "Coop Group",
    material: "Organic",
    category: "Food",
    condition: "New",
  },
  {
    id: "used-clothes",
    title: "Used clothes",
    meta: "10 items • Good condition",
    tag: "Sale",
    distance: "3.6 km",
    district: "Goma",
    postedBy: "Sarah B.",
    material: "Textile",
    category: "Clothing",
    condition: "Good",
  },
  {
    id: "old-smartphones",
    title: "Old smartphones",
    meta: "3 pieces • Working",
    tag: "Exchange",
    distance: "5.2 km",
    district: "Rubavu",
    postedBy: "Daniel K.",
    material: "Electronics",
    category: "Phones",
    condition: "Fair",
  },
  {
    id: "metal-pots",
    title: "Metal pots",
    meta: "4 pieces • Good condition",
    tag: "Free",
    distance: "1.8 km",
    district: "Gisenyi",
    postedBy: "Chantal D.",
    material: "Metal",
    category: "Cookware",
    condition: "Good",
  },
];

export const FEATURED_LISTING: ExchangeListing = {
  id: "diy-storage-jars",
  title: "DIY storage jars",
  meta: "5 pieces • New condition",
  tag: "Exchange",
  distance: "1.5 km",
  district: "Rubavu",
  postedBy: "Lina M.",
  material: "Glass",
  category: "Container",
  condition: "New",
  featured: true,
};

export const POPULAR_CATEGORIES: ExchangeCategory[] = [
  { label: "Organic" },
  { label: "Paper/Cardboard" },
  { label: "Plastic" },
  { label: "Glass" },
  { label: "Metal" },
  { label: "Textile" },
  { label: "Electronics" },
];

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

/**
 * Extra listings from Kimihurura. Not part of the marketplace grid; they
 * fill the "More items from this area" section of Kimihurura listings and
 * each has its own detail page.
 */
export const AREA_LISTINGS: ExchangeListing[] = [
  {
    id: "plastic-bottle-planter",
    title: "Plastic Bottle Planter",
    meta: "1 piece • Good condition",
    tag: "Exchange",
    distance: "2.1 km",
    district: "Kimihurura",
    postedBy: "Eric H.",
    material: "Plastic",
    category: "Planter",
    condition: "Good",
  },
  {
    id: "cardboard-box",
    title: "Cardboard Box",
    meta: "1 box • Good condition",
    tag: "Free",
    distance: "2.3 km",
    district: "Kimihurura",
    postedBy: "Aline U.",
    material: "Paper",
    category: "Packaging",
    condition: "Good",
  },
  {
    id: "old-clothes-shirt",
    title: "Old Clothes (Shirt)",
    meta: "1 item • Fair condition",
    tag: "Exchange",
    distance: "2.0 km",
    district: "Kimihurura",
    postedBy: "Eric H.",
    material: "Textile",
    category: "Clothing",
    condition: "Fair",
  },
  {
    id: "food-container",
    title: "Food Container",
    meta: "2 pieces • Good condition",
    tag: "Sale",
    distance: "2.6 km",
    district: "Kimihurura",
    postedBy: "Aline U.",
    material: "Glass",
    category: "Container",
    condition: "Good",
  },
];

/** Every item that has a detail page. */
export const ALL_ITEMS: ExchangeListing[] = [
  ...LISTINGS,
  FEATURED_LISTING,
  ...AREA_LISTINGS,
];

/** Poster identity shown in the detail page's seller card. */
export interface ExchangePoster {
  name: string;
  memberSince: string;
  rating: number;
  exchangeCount: number;
  location: string;
  distanceAway: string;
  online: boolean;
}

/** Per-poster profile data; unknown posters fall back to DEFAULT_PROFILE. */
type PosterProfile = Pick<
  ExchangePoster,
  "memberSince" | "rating" | "exchangeCount" | "online"
>;

const DEFAULT_PROFILE: PosterProfile = {
  memberSince: "2025",
  rating: 4.5,
  exchangeCount: 1,
  online: false,
};

export const POSTER_PROFILES: Record<string, PosterProfile> = {
  "Amina K.": {
    memberSince: "Aug 2025",
    rating: 4.8,
    exchangeCount: 12,
    online: true,
  },
  "James T.": {
    memberSince: "Mar 2025",
    rating: 4.6,
    exchangeCount: 7,
    online: false,
  },
  "Grace N.": {
    memberSince: "Jan 2026",
    rating: 4.9,
    exchangeCount: 4,
    online: true,
  },
  "Patrick M.": {
    memberSince: "Nov 2024",
    rating: 4.4,
    exchangeCount: 15,
    online: false,
  },
  "Coop Group": {
    memberSince: "Jun 2024",
    rating: 4.9,
    exchangeCount: 38,
    online: true,
  },
  "Sarah B.": {
    memberSince: "Feb 2026",
    rating: 4.7,
    exchangeCount: 3,
    online: false,
  },
  "Daniel K.": {
    memberSince: "Sep 2025",
    rating: 4.5,
    exchangeCount: 9,
    online: false,
  },
  "Chantal D.": {
    memberSince: "Apr 2025",
    rating: 4.8,
    exchangeCount: 11,
    online: true,
  },
  "Lina M.": {
    memberSince: "Dec 2024",
    rating: 5.0,
    exchangeCount: 21,
    online: false,
  },
  "Eric H.": {
    memberSince: "Jul 2025",
    rating: 4.6,
    exchangeCount: 6,
    online: true,
  },
  "Aline U.": {
    memberSince: "Oct 2025",
    rating: 4.7,
    exchangeCount: 5,
    online: false,
  },
};

/** Icon/value pair in the item overview (Category / Material / Size). */
export interface ExchangeItemAttribute {
  label: string;
  value: string;
}

/** One row of the "Exchange Details" table. */
export interface ExchangeDetailRow {
  label: string;
  value: string;
}

/** Card in the "More Exchange Items from this Area" grid. */
export interface AreaExchangeItem {
  id: string;
  title: string;
  tag: ListingTag;
  location: string;
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
  /** Gallery art keys — the UI maps them to artwork (see ITEM_ART). */
  gallery: string[];
  details: ExchangeDetailRow[];
  poster: ExchangePoster;
  pickupPoint: string;
  pickupNote: string;
  whyExchange: string;
  shareNote: string;
  areaItems: AreaExchangeItem[];
}

/** Max cards in the "More Exchange Items from this Area" grid. */
export const AREA_ITEMS_LIMIT = 4;

const BADGES: Record<ListingTag, string> = {
  Free: "Free Item",
  Exchange: "Exchange Item",
  Sale: "For Sale",
};

const TYPE_LABELS: Record<ListingTag, string> = {
  Free: "Give away (you give this item, no return needed)",
  Exchange: "Swap (you give this item, get something else)",
  Sale: "Sale (you give this item, receive a small fee)",
};

const PREFERRED_EXCHANGE: Record<ListingTag, string> = {
  Free: "Nothing — free to a good home",
  Exchange: "Flexible — suggest what you have",
  Sale: "Small fee, negotiable with the poster",
};

type DesignedCopy = Partial<
  Pick<ExchangeItemDetail, "statusNotes" | "description" | "gallery">
> & { size?: string };

/**
 * Hand-written copy from the approved Glass Jar design, layered on top of
 * the listing's own data so the card and the detail page always agree.
 */
const DESIGNED_COPY: Record<string, DesignedCopy> = {
  "glass-jars": {
    statusNotes: ["Clean", "Reusable", "Good condition"],
    size: "10 pieces (various sizes)",
    description: [
      "These glass jars are in good condition and can be reused for storage, decoration or other creative projects.",
      "A great item to give a second life!",
    ],
    gallery: ["jar-hero", "jar-lids", "jar-stack"],
  },
};

/** Other items in the same district as `listing`, excluding itself. */
export function areaItemsFor(listing: ExchangeListing): AreaExchangeItem[] {
  return ALL_ITEMS.filter(
    (other) => other.district === listing.district && other.id !== listing.id,
  )
    .slice(0, AREA_ITEMS_LIMIT)
    .map((other) => ({
      id: other.id,
      title: other.title,
      tag: other.tag,
      location: other.district,
    }));
}

/**
 * Detail payload for any exchange item, built from the listing's own data
 * (plus DESIGNED_COPY where the design supplies richer text).
 */
export function getExchangeItemDetail(id: string): ExchangeItemDetail | null {
  const listing = ALL_ITEMS.find((candidate) => candidate.id === id);
  if (!listing) return null;

  const designed: DesignedCopy = DESIGNED_COPY[id] ?? {};
  const [quantity] = listing.meta.split("•");
  const profile = POSTER_PROFILES[listing.postedBy] ?? DEFAULT_PROFILE;

  return {
    id: listing.id,
    tag: listing.tag,
    badge: BADGES[listing.tag],
    title: listing.title,
    statusNotes: designed.statusNotes ?? [
      `${listing.condition} condition`,
      "Available now",
    ],
    attributes: [
      { label: "Category", value: listing.category },
      { label: "Material", value: listing.material },
      { label: "Size", value: designed.size ?? quantity.trim() },
    ],
    description: designed.description ?? [
      `${listing.title} in ${listing.condition.toLowerCase()} condition, listed by ${listing.postedBy}.`,
      `Located in ${listing.district}, about ${listing.distance} away. Message the poster to arrange pickup!`,
    ],
    ecoNote: "Let's reduce waste together!",
    gallery: designed.gallery ?? [listing.id],
    details: [
      { label: "Type", value: TYPE_LABELS[listing.tag] },
      { label: "Condition", value: listing.condition },
      { label: "Availability", value: "Now" },
      {
        label: "Pickup Location",
        value: `${listing.district} (exact spot shared after matching)`,
      },
      { label: "Preferred Exchange", value: PREFERRED_EXCHANGE[listing.tag] },
      { label: "Posted", value: "Today" },
    ],
    poster: {
      name: listing.postedBy,
      ...profile,
      location: `${listing.district}, Rwanda`,
      distanceAway: `~ ${listing.distance} away`,
    },
    pickupPoint: listing.district,
    pickupNote: "Near community collection point",
    whyExchange:
      "Give your items a new purpose, reduce waste, and support a greener community.",
    shareNote: "Help someone find this item!",
    areaItems: areaItemsFor(listing),
  };
}
