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
    material: "Metal",
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
    condition: "Good",
  },
];

export const FEATURED_LISTING: ExchangeListing = {
  id: "diy-storage-jars",
  title: "DIY storage jars",
  meta: "5 pieces • Excellent condition",
  tag: "Exchange",
  distance: "1.5 km",
  district: "Rubavu",
  postedBy: "Lina M.",
  material: "Glass",
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
  "Textile",
  "Electronics",
];

export const CONDITION_FILTERS: ConditionFilter[] = ["New", "Good", "Fair"];
export const TYPE_FILTERS: ListingTag[] = ["Free", "Exchange", "Sale"];
