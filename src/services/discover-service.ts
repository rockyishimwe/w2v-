/**
 * Discover service layer — idea cards and AI-generated DIY guides.
 * Ideas come from the real DB (grown by assistant chats and explicit
 * generation); guides are AI-generated on demand and cached server-side.
 */
import { api } from "@/lib/api-client";

export type IdeaTag = "DIY" | "Reuse";

/** One idea card on the Discover page. */
export interface DiscoverIdea {
  id: string;
  title: string;
  description: string;
  tag: IdeaTag;
  time: string;
  impact: string;
  categories: string[];
  artKey: string;
}

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

/** Full AI-generated DIY guide payload. */
export interface DiyGuide {
  /** Idea slug this guide belongs to. */
  id: string;
  /** UI art key for the idea's imagery. */
  artKey?: string;
  tag: "DIY";
  title: string;
  intro: string;
  timeNeeded: string;
  difficulty: "Easy" | "Medium";
  impact: string;
  estimatedCost: string;
  materials: DiyMaterial[];
  steps: DiyStep[];
}

/** GET /api/ideas — all stored ideas, optionally by category. */
export function fetchIdeas(
  category?: string,
): Promise<{ data: DiscoverIdea[] }> {
  const qs =
    category && category !== "All"
      ? `?category=${encodeURIComponent(category)}`
      : "";
  return api.get<{ data: DiscoverIdea[] }>(`/api/ideas${qs}`);
}

/**
 * GET /api/ideas/[id]/guide — cached or freshly AI-generated guide.
 * Throws when the idea has no guide and AI is unavailable.
 */
export function fetchGuide(id: string): Promise<DiyGuide> {
  return api.get<DiyGuide>(`/api/ideas/${id}/guide`);
}

/**
 * POST /api/ideas/generate — asks the AI to invent one idea for a
 * material and stores it (auth required).
 */
export function generateIdea(
  material: string,
): Promise<DiscoverIdea & { id: string }> {
  return api.post<DiscoverIdea & { id: string }>("/api/ideas/generate", {
    material,
  });
}
