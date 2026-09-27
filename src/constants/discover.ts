/**
 * Discover page data — matches the approved design.
 * Mock dataset, swap for the real API via the service layer later;
 * UI consumes types only.
 */

import type { OutcomeCategory } from "@/types";

/** Filter chip above the idea grid (design shows "All" active). */
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
};

/**
 * One idea card in "Trending Ideas" / "Recommended for You".
 * `artKey` selects its SVG stand-in (see IDEA_ART in discover-art).
 */
export interface DiscoverIdea {
  id: string;
  title: string;
  description: string;
  tag: Extract<OutcomeCategory, "DIY" | "Reuse">;
  time: string;
  impact: string;
  /** Category chips this idea belongs to (design filter behavior). */
  categories: Exclude<DiscoverCategoryFilter, "All">[];
  artKey: string;
}

/** Ideas in the design's "Trending Ideas" rail order. */
export const TRENDING_IDEAS: DiscoverIdea[] = [
  {
    id: "hanging-planter",
    title: "Hanging Planter",
    description: "Turn plastic bottles into beautiful hanging planters.",
    tag: "DIY",
    time: "1–2 hours",
    impact: "1 item reused",
    categories: ["Plastic"],
    artKey: "hanging-planter",
  },
  {
    id: "candle-jars",
    title: "Candle Jars",
    description: "Repurpose glass jars into natural candles.",
    tag: "DIY",
    time: "1–2 hours",
    impact: "1 item reused",
    categories: ["Glass"],
    artKey: "candle-jars",
  },
  {
    id: "desk-organizer",
    title: "Desk Organizer",
    description: "Use cardboard boxes to create a stylish organizer.",
    tag: "DIY",
    time: "30–60 min",
    impact: "1 item reused",
    categories: ["Cardboard"],
    artKey: "desk-organizer",
  },
];

/** Ideas in the design's "Recommended for You" order. */
export const RECOMMENDED_IDEAS: DiscoverIdea[] = [
  {
    id: "hanging-planter",
    title: "Hanging Planter",
    description: "Turn plastic bottles into beautiful hanging planters.",
    tag: "DIY",
    time: "1–2 hours",
    impact: "1 item reused",
    categories: ["Plastic"],
    artKey: "hanging-planter",
  },
  {
    id: "string-lights",
    title: "String Lights",
    description: "Glow up your space with jar-powered string lights.",
    tag: "DIY",
    time: "3–4 hours",
    impact: "1 item reused",
    categories: ["Glass"],
    artKey: "string-lights",
  },
  {
    id: "herb-garden",
    title: "Herb Garden",
    description: "Grow kitchen herbs in reused tin cans.",
    tag: "Reuse",
    time: "2–3 hours",
    impact: "1 item reused",
    categories: ["Organic"],
    artKey: "herb-garden",
  },
];

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

/** Rows in the right rail's "Recycling Tips" list. */
export const RECYCLING_TIPS: string[] = [
  "How to clean and prepare recyclables",
  "What can and cannot be recycled",
  "Composting at home",
  "Reducing waste in daily life",
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

/** Ideas that pass the active category chip (All passes everything). */
export function filterIdeasByCategory(
  ideas: DiscoverIdea[],
  category: DiscoverCategoryFilter,
): DiscoverIdea[] {
  if (category === "All") return ideas;
  return ideas.filter((idea) => idea.categories.includes(category));
}
