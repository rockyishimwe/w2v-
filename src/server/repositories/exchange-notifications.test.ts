/**
 * Verifies the exchange repository's notification side effects: a new
 * interest pings the poster (once), and a new listing pings neighbors in
 * the same district.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Mock } from "vitest";

vi.mock("@/server/lib/prisma", () => ({
  prisma: {
    exchangeListing: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
    },
    exchangeInterest: {
      findUnique: vi.fn(),
      upsert: vi.fn(),
    },
    notification: {
      create: vi.fn(),
    },
  },
}));

vi.mock("@/server/lib/logger", () => ({
  logger: { error: vi.fn(), info: vi.fn(), warn: vi.fn(), debug: vi.fn() },
}));

import { createInterest, createListing } from "./exchange-repository";
import { prisma } from "@/server/lib/prisma";

const db = prisma as unknown as {
  exchangeListing: Record<string, Mock>;
  exchangeInterest: Record<string, Mock>;
  notification: Record<string, Mock>;
};

const listing = {
  id: "row-1",
  seedId: "lst-1",
  title: "Glass jars (x12)",
  meta: "12 pieces • Good",
  tag: "Exchange",
  district: "Kicukiro",
  distanceKm: 2.4,
  postedByName: "Amina Uwase",
  postedById: "poster-1",
  material: "Glass",
  category: "Jars",
  condition: "Good",
  featured: false,
  imagePath: null,
};

beforeEach(() => {
  vi.clearAllMocks();
  db.exchangeListing.findMany.mockResolvedValue([]);
  db.notification.create.mockResolvedValue({ id: "n" });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("createInterest notifications", () => {
  it("notifies the poster on a first interest", async () => {
    db.exchangeListing.findUnique.mockResolvedValue(listing);
    db.exchangeInterest.findUnique.mockResolvedValue(null);
    db.exchangeInterest.upsert.mockResolvedValue({});

    await createInterest("lst-1", "fan-1", "Still available?");

    expect(db.notification.create).toHaveBeenCalledTimes(1);
    expect(db.notification.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: "poster-1",
        type: "interest",
        href: "/exchange/lst-1",
      }),
    });
  });

  it("does not notify twice for a repeated interest", async () => {
    db.exchangeListing.findUnique.mockResolvedValue(listing);
    db.exchangeInterest.findUnique.mockResolvedValue({ id: "i-1" });
    db.exchangeInterest.upsert.mockResolvedValue({});

    await createInterest("lst-1", "fan-1", "Still available?");

    expect(db.notification.create).not.toHaveBeenCalled();
  });

  it("does not notify when the interested user is the poster", async () => {
    db.exchangeListing.findUnique.mockResolvedValue(listing);
    db.exchangeInterest.findUnique.mockResolvedValue(null);
    db.exchangeInterest.upsert.mockResolvedValue({});

    await createInterest("lst-1", "poster-1");

    expect(db.notification.create).not.toHaveBeenCalled();
  });

  it("throws notFound for an unknown listing without notifying", async () => {
    db.exchangeListing.findUnique.mockResolvedValue(null);

    await expect(createInterest("missing", "fan-1")).rejects.toThrow(
      "Listing not found.",
    );
    expect(db.notification.create).not.toHaveBeenCalled();
  });
});

describe("createListing notifications", () => {
  it("notifies distinct posters in the same district, not the creator", async () => {
    db.exchangeListing.create.mockResolvedValue({
      ...listing,
      postedById: "me-1",
      seedId: "lst-2",
    });
    db.exchangeListing.findMany.mockResolvedValue([
      { postedById: "neighbor-1" },
      { postedById: "neighbor-2" },
    ]);

    await createListing("me-1", "Kai M.", {
      title: "Cardboard boxes",
      meta: "10 pieces • Fair",
      tag: "Free",
      district: "Kicukiro",
      distanceKm: 1.2,
      material: "Paper",
      category: "Boxes",
      condition: "Fair",
    });

    expect(db.exchangeListing.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          district: "Kicukiro",
          status: "available",
        }),
      }),
    );
    expect(db.notification.create).toHaveBeenCalledTimes(2);
    expect(
      db.notification.create.mock.calls.every((call) => {
        const data = (call[0] as { data: { userId: string } }).data;
        return data.userId !== "me-1";
      }),
    ).toBe(true);
  });

  it("sends no notifications when there are no neighbors", async () => {
    db.exchangeListing.create.mockResolvedValue({
      ...listing,
      postedById: "me-1",
    });
    db.exchangeListing.findMany.mockResolvedValue([]);

    await createListing("me-1", "Kai M.", {
      title: "Cardboard boxes",
      meta: "10 pieces • Fair",
      tag: "Free",
      district: "Nyarugenge",
      distanceKm: 3,
      material: "Paper",
      category: "Boxes",
      condition: "Fair",
    });

    expect(db.notification.create).not.toHaveBeenCalled();
  });
});
