/**
 * Waste Assistant chat page data — matches the approved design.
 * Mock dataset, swap for the real API via the service layer later;
 * UI consumes types only.
 */

import type { Route } from "next";

/** Material quick-reply chips shown under the welcome bubble. */
export interface AssistantChip {
  label: string;
  /** User message sent when the chip is clicked. */
  message: string;
}

export const ASSISTANT_CHIPS: AssistantChip[] = [
  {
    label: "I have plastic items",
    message: "I have some plastic bottles. What can I do with them?",
  },
  {
    label: "I have cardboard",
    message: "I have cardboard boxes. What can I do with them?",
  },
  {
    label: "I have food scraps",
    message: "I have food scraps. What can I do with them?",
  },
  {
    label: "I have glass items",
    message: "I have glass jars. What can I do with them?",
  },
  {
    label: "I have old clothes",
    message: "I have old clothes. What can I do with them?",
  },
  {
    label: "Help me decide",
    message: "Help me decide what to do with my waste.",
  },
];

/** First assistant bubble. */
export const WELCOME_MESSAGE = {
  greeting: "Hi Vanessa! 👋",
  body: "I'm your Waste2Value assistant. I can help you find creative ways to reuse, recycle, or exchange your waste, answer your questions, and guide you through your options.",
  prompt: "What would you like to do today?",
};

/** Difficulty level for an assistant idea card. */
export type AssistantIdeaDifficulty = "Easy" | "Medium";

/** One idea card the assistant attaches to a reply. */
export interface AssistantIdea {
  id: string;
  title: string;
  difficulty: AssistantIdeaDifficulty;
  time: string;
  /** DIY guide page to open from "View details". */
  href: Route;
  artKey: string;
}

/** One canned assistant reply (matched on user message keywords). */
export interface AssistantReply {
  /** Any of these substrings (lowercased) in the user message trigger this reply. */
  keywords: string[];
  text: string;
  ideas: AssistantIdea[];
}

/** Icons/times/difficulties mirror the approved design's three cards. */
export const PLASTIC_BOTTLE_REPLY: AssistantReply = {
  keywords: ["plastic"],
  text: "Great! Plastic bottles can be reused in many creative ways. Here are a few ideas for you:",
  ideas: [
    {
      id: "vertical-herb-garden",
      title: "Vertical Herb Garden",
      difficulty: "Easy",
      time: "30 min",
      href: "/scanner/diy",
      artKey: "vertical-herb-garden",
    },
    {
      id: "bird-feeder",
      title: "Bird Feeder",
      difficulty: "Easy",
      time: "20 min",
      href: "/scanner/diy",
      artKey: "bird-feeder",
    },
    {
      id: "pen-holder",
      title: "Pen Holder",
      difficulty: "Medium",
      time: "1 hr",
      href: "/scanner/diy",
      artKey: "pen-holder",
    },
  ],
};

export const CARDBOARD_REPLY: AssistantReply = {
  keywords: ["cardboard"],
  text: "Cardboard is one of the most versatile materials to reuse. Here are some ideas:",
  ideas: [
    {
      id: "desk-organizer",
      title: "Desk Organizer",
      difficulty: "Easy",
      time: "30–60 min",
      href: "/scanner/diy",
      artKey: "desk-organizer",
    },
    {
      id: "storage-boxes",
      title: "Storage Boxes",
      difficulty: "Easy",
      time: "20 min",
      href: "/scanner/diy",
      artKey: "storage-boxes",
    },
    {
      id: "cat-house",
      title: "Pet House",
      difficulty: "Medium",
      time: "2 hrs",
      href: "/scanner/diy",
      artKey: "cat-house",
    },
  ],
};

export const FOOD_SCRAPS_REPLY: AssistantReply = {
  keywords: ["food scraps", "food waste", "compost", "organic"],
  text: "Food scraps are valuable! They can become compost for your garden or feed for animals:",
  ideas: [
    {
      id: "compost-bin",
      title: "Compost Bin",
      difficulty: "Easy",
      time: "1–2 weeks",
      href: "/scanner/diy",
      artKey: "compost-bin",
    },
    {
      id: "broth-stock",
      title: "Vegetable Broth",
      difficulty: "Easy",
      time: "1 hr",
      href: "/scanner/diy",
      artKey: "broth-stock",
    },
    {
      id: "planter-food",
      title: "Plant Feed",
      difficulty: "Easy",
      time: "Instant",
      href: "/scanner/diy",
      artKey: "planter-food",
    },
  ],
};

export const GLASS_REPLY: AssistantReply = {
  keywords: ["glass", "jar"],
  text: "Glass jars are treasures — durable, clean and endlessly reusable:",
  ideas: [
    {
      id: "jar-planter",
      title: "Jar Planter",
      difficulty: "Easy",
      time: "30–45 min",
      href: "/scanner/diy",
      artKey: "jar-planter",
    },
    {
      id: "candle-jars",
      title: "Candle Jars",
      difficulty: "Easy",
      time: "1–2 hours",
      href: "/scanner/diy",
      artKey: "candle-jars",
    },
    {
      id: "pantry-storage",
      title: "Pantry Storage",
      difficulty: "Easy",
      time: "Instant",
      href: "/scanner/diy",
      artKey: "pantry-storage",
    },
  ],
};

export const CLOTHES_REPLY: AssistantReply = {
  keywords: ["clothes", "textile", "shirt", "fabric"],
  text: "Old clothes still have a lot of life left in them. Here's how to give them a second chance:",
  ideas: [
    {
      id: "tote-bag",
      title: "Tote Bag",
      difficulty: "Easy",
      time: "45 min",
      href: "/scanner/diy",
      artKey: "tote-bag",
    },
    {
      id: "cleaning-rags",
      title: "Cleaning Rags",
      difficulty: "Easy",
      time: "Instant",
      href: "/scanner/diy",
      artKey: "cleaning-rags",
    },
    {
      id: "quilt-patches",
      title: "Quilt Patches",
      difficulty: "Medium",
      time: "3–4 hours",
      href: "/scanner/diy",
      artKey: "quilt-patches",
    },
  ],
};

/** Reply used when no keyword matches (including "Help me decide"). */
export const FALLBACK_REPLY: AssistantReply = {
  keywords: [],
  text: "No problem — tell me what materials you have (plastic, cardboard, glass, clothes or food scraps) and I'll suggest what you can do with them. You can also scan an item for a precise analysis!",
  ideas: [],
};

/** All keyword-matched replies. First match wins. */
export const ASSISTANT_REPLIES: AssistantReply[] = [
  PLASTIC_BOTTLE_REPLY,
  CARDBOARD_REPLY,
  FOOD_SCRAPS_REPLY,
  GLASS_REPLY,
  CLOTHES_REPLY,
];

/** Follow-up question appended after an ideas reply. */
export const FOLLOW_UP_QUESTION =
  "Would you like to see more ideas, or do you want help finding places to exchange your plastic bottles?";
