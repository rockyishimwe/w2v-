import type { OutcomeCategory } from "@/types";

/** One material required by a DIY guide. */
export interface DiyMaterial {
  name: string;
  note: string;
}

/** One numbered step of a DIY guide. */
export interface DiyStep {
  title: string;
  description: string;
}

/** A related idea shown in the "Similar Ideas" rail. */
export interface DiySimilarIdea {
  title: string;
  tag: Exclude<OutcomeCategory, "Exchange" | "Recycle" | "Dispose safely">;
  time: string;
  impact: string;
}

/** Full payload for the recommendation detail (DIY guide) page. */
export interface DiyGuide {
  tag: "DIY";
  title: string;
  intro: string;
  timeNeeded: string;
  difficulty: string;
  impact: string;
  estimatedCost: string;
  materials: DiyMaterial[];
  steps: DiyStep[];
}

/**
 * Placeholder content matching the approved design — swap for the real API
 * response via the service layer later without touching UI code.
 */
export const DIY_GUIDE: DiyGuide = {
  tag: "DIY",
  title: "Turn your glass jar into a planter",
  intro:
    "Give your glass jar a new life by turning it into a beautiful indoor planter. It's simple, practical, and helps reduce waste!",
  timeNeeded: "30 – 45 min",
  difficulty: "Easy",
  impact: "1 item reused",
  estimatedCost: "Free – 1,000 RWF",
  materials: [
    { name: "Glass jar", note: "(cleaned)" },
    { name: "Soil", note: "(planting mix)" },
    { name: "Small stones", note: "(drainage)" },
    { name: "Plant", note: "(your choice)" },
    { name: "Twine or ribbon", note: "(for decoration)" },
  ],
  steps: [
    {
      title: "Clean the jar",
      description: "Wash the jar thoroughly and make sure it's completely dry.",
    },
    {
      title: "Add drainage",
      description: "Place a layer of small stones at the bottom (about 2–3 cm).",
    },
    {
      title: "Add soil",
      description: "Fill with planting soil, leaving a little space at the top.",
    },
    {
      title: "Plant and decorate",
      description:
        "Place your plant, add more soil, and decorate with twine or ribbon if you like.",
    },
  ],
};

export const SIMILAR_IDEAS: DiySimilarIdea[] = [
  { title: "Candle Lantern", tag: "DIY", time: "1–2 hours", impact: "1 item reused" },
  { title: "Hanging Lights", tag: "DIY", time: "3–4 hours", impact: "1 item reused" },
  { title: "Herb Garden Planter", tag: "DIY", time: "2–3 hours", impact: "1 item reused" },
  { title: "Food Storage Jar", tag: "Reuse", time: "Instant", impact: "1 item reused" },
];
