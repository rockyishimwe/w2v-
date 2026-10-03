/**
 * Singleton Prisma Client wired for Prisma ORM v7 driver adapters.
 *
 * PostgreSQL only — the app runs on serverless (Vercel), where a SQLite
 * file has nowhere to live between invocations. DATABASE_URL is required;
 * use a pooled connection string in production (Neon pooler, Supabase
 * pgbouncer, Vercel Postgres) because every instance opens its own pool.
 *
 * Next.js hot-reloads modules in dev, so we stash the instance on
 * globalThis to avoid exhausting database connections. The client is
 * created lazily (on first property access) so that importing a module
 * that touches the database — a unit test, a build-time analysis pass —
 * does not require DATABASE_URL to be set.
 */
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/server/generated/prisma/client";

type Cache = {
  __w2vPrisma?: PrismaClient;
};
const globalForPrisma = globalThis as unknown as Cache;

function createClient(): PrismaClient {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Point it at a PostgreSQL database (see README “Database”).",
    );
  }
  if (!url.startsWith("postgres://") && !url.startsWith("postgresql://")) {
    throw new Error(
      "DATABASE_URL must be a PostgreSQL connection string (postgres:// or postgresql://).",
    );
  }

  return new PrismaClient({
    adapter: new PrismaPg({
      connectionString: url,
      // Serverless instances are short-lived and handle few concurrent
      // requests each; a small pool keeps the database's connection
      // budget from being eaten by idle lambdas.
      max: Number(process.env.DATABASE_POOL_MAX ?? 5),
    }),
  });
}

function client(): PrismaClient {
  globalForPrisma.__w2vPrisma ??= createClient();
  return globalForPrisma.__w2vPrisma;
}

export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, property) {
    const value = Reflect.get(client(), property) as unknown;
    // Methods must keep the real client as `this` (`$transaction`, the
    // model delegates' internals), so bind instead of handing back a
    // detached function.
    return typeof value === "function" ? value.bind(client()) : value;
  },
  has(_target, property) {
    return property in client();
  },
});
