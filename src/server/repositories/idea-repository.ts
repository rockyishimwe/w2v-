/**
 * Idea repository: discover-page idea cards and AI-generated DIY guides.
 * Ideas only enter the system through real AI generation — nothing is
 * seeded or hardcoded.
 */
import { prisma } from "../lib/prisma";
import { notFound } from "../lib/errors";
import type { Prisma } from "../generated/prisma/client";

export interface GeneratedIdeaInput {
  title: string;
  description: string;
  tag: "DIY" | "Reuse";
  time: string;
  impact: string;
  categories: string[];
  artKey: string;
}

/** DB row → the flat idea-card shape the discover page renders. */
function toCard(idea: {
  seedId: string;
  title: string;
  description: string;
  tag: string;
  time: string;
  impact: string;
  categories: string;
  artKey: string;
}) {
  return {
    id: idea.seedId,
    title: idea.title,
    description: idea.description,
    tag: idea.tag as "DIY" | "Reuse",
    time: idea.time,
    impact: idea.impact,
    categories: idea.categories.split(","),
    artKey: idea.artKey,
  };
}

export async function listIdeas(category?: string) {
  const rows = await prisma.idea.findMany({
    where:
      category && category !== "All"
        ? { categories: { contains: category } }
        : undefined,
    orderBy: { createdAt: "desc" },
    take: 60,
  });
  return rows.map(toCard);
}

export async function getIdea(seedId: string) {
  const idea = await prisma.idea.findUnique({ where: { seedId } });
  return idea ? toCard(idea) : null;
}

/**
 * Persists one AI-generated idea. Dedupes on a slug derived from the
 * title so the same idea is never stored twice.
 */
export async function upsertIdea(input: GeneratedIdeaInput) {
  const seedId = slugify(input.title);
  const row = await prisma.idea.upsert({
    where: { seedId },
    update: {
      title: input.title,
      description: input.description,
      tag: input.tag,
      time: input.time,
      impact: input.impact,
      categories: input.categories.join(","),
      artKey: input.artKey,
    },
    create: { ...input, categories: input.categories.join(","), seedId },
  });
  return toCard(row);
}

/** Slugifies a title into a stable public id ("Hanging Planter" → "hanging-planter"). */
export function slugify(title: string): string {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || `idea-${Date.now().toString(36)}`
  );
}

/** Full DIY guide payload for one idea, by public slug id. */
export async function getGuidePayload(seedId: string) {
  const idea = await prisma.idea.findUnique({ where: { seedId } });
  if (!idea) throw notFound("Idea not found.");
  if (!idea.guide) throw notFound("Guide not generated yet.");
  return {
    id: idea.seedId,
    title: idea.title,
    artKey: idea.artKey,
    categories: idea.categories.split(","),
    guide: idea.guide as Record<string, unknown>,
  };
}

/** Caches an AI-generated guide on its idea row. */
export async function saveGuide(seedId: string, guide: unknown) {
  await prisma.idea.update({
    where: { seedId },
    data: { guide: guide as Prisma.InputJsonValue },
  });
}
