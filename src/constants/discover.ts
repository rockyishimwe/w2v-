/**
 * Discover page UI constants — hero copy, category chips and rail card
 * copy. All idea DATA comes from the API (see services/discover-service);
 * nothing here is mock content.
 */

/** Filter chip above the idea grid ("All" active by default). */
export type DiscoverCategoryFilter =
  "All" | "Plastic" | "Glass" | "Cardboard" | "Organic" | "Textile";

/** One chip in the "Browse by Category" row. */
export interface DiscoverCategory {
  label: DiscoverCategoryFilter;
}

export const DISCOVER_CATEGORIES: DiscoverCategory[] = [
  { label: "All" },
  { label: "Plastic" },
  { label: "Glass" },
  { label: "Cardboard" },
  { label: "Organic" },
  { label: "Textile" },
];

/** Hero pill above the headline. */
export const DISCOVER_HERO = {
  pill: "Small actions. Big impact.",
  title: "Turn waste into\nsomething valuable",
  body: "Discover reuse ideas, DIY projects, and sustainable alternatives for a cleaner, greener tomorrow.",
  cta: "Explore Ideas",
} as const;

/** Chips in the right rail's "Popular Searches". */
export const POPULAR_SEARCHES: string[] = [
  "plastic bottle",
  "cardboard box",
  "glass jar",
  "old clothes",
  "tire",
  "food waste",
  "electronics",
];

/** Materials offered in the AI "Recycling Tips" widget. */
export const TIP_MATERIALS: string[] = [
  "plastic bottles",
  "glass jars",
  "cardboard",
  "food scraps",
  "old clothes",
];

/** Right rail's "Did you know?" card. */
export const DID_YOU_KNOW = {
  title: "Did you know?",
  body: "A single plastic bottle can be turned into a flower pot, a pencil holder, or even a lamp!",
};

/** Right rail's assistant card. */
export const ASSISTANT_CARD = {
  title: "Need help thinking of an idea?",
  body: "Chat with Waste Assistant for personalized suggestions.",
  cta: "Chat Now",
};
