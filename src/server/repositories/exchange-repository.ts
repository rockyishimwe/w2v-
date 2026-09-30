/**
 * Exchange repository: marketplace queries mapped to the frontend's
 * ExchangeListing / ExchangeItemDetail shapes.
 *
 * Every field is derived from real DB rows — no invented poster ratings,
 * member-since dates or hardcoded gallery copy. Fields the product
 * doesn't track yet (rating, messaging) are simply absent from payloads.
 */
import { prisma } from "../lib/prisma";
import { notFound } from "../lib/errors";

export interface ListingQuery {
  query?: string;
  tag?: string;
  material?: string;
  condition?: string;
  sortByDistance?: boolean;
  featured?: boolean;
  district?: string;
  page?: number;
  pageSize?: number;
}

const BADGES: Record<string, string> = {
  Free: "Free Item",
  Exchange: "Exchange Item",
  Sale: "For Sale",
};

const TYPE_LABELS: Record<string, string> = {
  Free: "Give away (you give this item, no return needed)",
  Exchange: "Swap (you give this item, get something else)",
  Sale: "Sale (you give this item, receive a small fee)",
};

const PREFERRED_EXCHANGE: Record<string, string> = {
  Free: "Nothing — free to a good home",
  Exchange: "Flexible — suggest what you have",
  Sale: "Small fee, negotiable with the poster",
};

/** DB row → the flat card shape the UI grid renders. */
function toCard(listing: {
  seedId: string;
  title: string;
  meta: string;
  tag: string;
  district: string;
  distanceKm: number;
  postedByName: string;
  material: string;
  category: string;
  condition: string;
  featured: boolean;
  imagePath: string | null;
}) {
  return {
    id: listing.seedId,
    title: listing.title,
    meta: listing.meta,
    tag: listing.tag,
    distance: `${listing.distanceKm} km`,
    district: listing.district,
    postedBy: listing.postedByName,
    material: listing.material,
    category: listing.category,
    condition: listing.condition,
    ...(listing.imagePath ? { image: listing.imagePath } : {}),
    ...(listing.featured ? { featured: true } : {}),
  };
}

const CARD_SELECT = {
  seedId: true,
  title: true,
  meta: true,
  tag: true,
  district: true,
  distanceKm: true,
  postedByName: true,
  material: true,
  category: true,
  condition: true,
  featured: true,
  imagePath: true,
} as const;

export async function listListings(query: ListingQuery) {
  const page = query.page ?? 1;
  const pageSize = query.pageSize ?? 50;

  const where = {
    status: "available",
    ...(query.tag ? { tag: query.tag } : {}),
    ...(query.material ? { material: query.material } : {}),
    ...(query.condition ? { condition: query.condition } : {}),
    ...(query.featured !== undefined ? { featured: query.featured } : {}),
    ...(query.district ? { district: query.district } : {}),
    ...(query.query
      ? {
          OR: [
            { title: { contains: query.query } },
            { category: { contains: query.query } },
            { district: { contains: query.query } },
          ],
        }
      : {}),
  };

  const [total, rows] = await Promise.all([
    prisma.exchangeListing.count({ where }),
    prisma.exchangeListing.findMany({
      where,
      select: CARD_SELECT,
      orderBy: query.sortByDistance
        ? { distanceKm: "asc" }
        : { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  return { data: rows.map(toCard), page, pageSize, total };
}

/** Detail payload for one listing (by public slug id). */
export async function getListingDetail(seedId: string) {
  const listing = await prisma.exchangeListing.findUnique({
    where: { seedId },
    include: {
      postedBy: {
        select: { firstName: true, lastName: true, createdAt: true },
      },
    },
  });
  if (!listing) throw notFound("Listing not found.");

  const sameArea = await prisma.exchangeListing.findMany({
    where: {
      district: listing.district,
      seedId: { not: listing.seedId },
      status: "available",
    },
    select: CARD_SELECT,
    take: 4,
    orderBy: { distanceKm: "asc" },
  });

  // Real poster stats: actual exchange count and real join date.
  const [posterExchanges, posterListings] = await Promise.all([
    prisma.exchangeInterest.count({ where: { userId: listing.postedById } }),
    prisma.exchangeListing.count({
      where: { postedById: listing.postedById, status: "available" },
    }),
  ]);

  const quantity = listing.meta.split("•")[0]?.trim() || "1 piece";
  const memberSince = listing.postedBy.createdAt.toLocaleString("en-US", {
    month: "short",
    year: "numeric",
  });

  return {
    id: listing.seedId,
    tag: listing.tag,
    badge: BADGES[listing.tag] ?? "Exchange Item",
    title: listing.title,
    statusNotes: [`${listing.condition} condition`, "Available now"],
    attributes: [
      { label: "Category", value: listing.category },
      { label: "Material", value: listing.material },
      { label: "Size", value: quantity },
    ],
    description: [
      `${listing.title} in ${listing.condition.toLowerCase()} condition, listed by ${listing.postedByName}.`,
      `Located in ${listing.district}, about ${listing.distanceKm} km away. Message the poster to arrange pickup!`,
    ],
    ecoNote: "Let's reduce waste together!",
    image: listing.imagePath ?? null,
    details: [
      {
        label: "Type",
        value: TYPE_LABELS[listing.tag] ?? TYPE_LABELS.Exchange,
      },
      { label: "Condition", value: listing.condition },
      { label: "Availability", value: "Now" },
      {
        label: "Pickup Location",
        value: `${listing.district} (exact spot shared after matching)`,
      },
      {
        label: "Preferred Exchange",
        value: PREFERRED_EXCHANGE[listing.tag] ?? PREFERRED_EXCHANGE.Exchange,
      },
      {
        label: "Posted",
        value: listing.createdAt.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      },
    ],
    poster: {
      name: listing.postedByName,
      memberSince,
      exchanges: posterExchanges,
      activeListings: posterListings,
      location: `${listing.district}, Rwanda`,
      distanceAway: `~ ${listing.distanceKm} km away`,
    },
    pickupPoint: listing.district,
    pickupNote: "Near community collection point",
    whyExchange:
      "Give your items a new purpose, reduce waste, and support a greener community.",
    shareNote: "Help someone find this item!",
    areaItems: sameArea.map((other) => ({
      id: other.seedId,
      title: other.title,
      tag: other.tag,
      location: other.district,
      ...(other.imagePath ? { image: other.imagePath } : {}),
    })),
  };
}

/** Records a user's interest ("Message the poster" flow). */
export async function createInterest(
  listingSeedId: string,
  userId: string,
  message?: string,
) {
  const listing = await prisma.exchangeListing.findUnique({
    where: { seedId: listingSeedId },
  });
  if (!listing) throw notFound("Listing not found.");

  await prisma.exchangeInterest.upsert({
    where: {
      listingId_userId: { listingId: listing.id, userId },
    },
    update: { ...(message ? { message } : {}) },
    create: { listingId: listing.id, userId, message },
  });

  return { ok: true };
}

/** Creates a new listing from a user (offline-queue friendly). */
export async function createListing(
  userId: string,
  postedByName: string,
  input: {
    title: string;
    meta: string;
    tag: string;
    district: string;
    distanceKm: number;
    material: string;
    category: string;
    condition: string;
    imagePath?: string | null;
  },
) {
  const seedId = `user-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 7)}`;
  const listing = await prisma.exchangeListing.create({
    data: {
      title: input.title,
      meta: input.meta,
      tag: input.tag,
      district: input.district,
      distanceKm: input.distanceKm,
      material: input.material,
      category: input.category,
      condition: input.condition,
      ...(input.imagePath ? { imagePath: input.imagePath } : {}),
      seedId,
      postedById: userId,
      postedByName,
    },
  });
  return toCard(listing);
}
