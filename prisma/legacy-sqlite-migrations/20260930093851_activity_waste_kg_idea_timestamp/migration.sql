/*
  Warnings:

  - You are about to drop the `GuideCache` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `distanceKm` on table `ExchangeListing` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ActivityEntry" ADD COLUMN "wasteKg" REAL;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "GuideCache";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ExchangeListing" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "seedId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "meta" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "distanceKm" REAL NOT NULL,
    "postedByName" TEXT NOT NULL,
    "postedById" TEXT NOT NULL,
    "material" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "condition" TEXT NOT NULL,
    "imagePath" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'available',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ExchangeListing_postedById_fkey" FOREIGN KEY ("postedById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ExchangeListing" ("category", "condition", "createdAt", "distanceKm", "district", "featured", "id", "imagePath", "material", "meta", "postedById", "postedByName", "seedId", "status", "tag", "title") SELECT "category", "condition", "createdAt", "distanceKm", "district", "featured", "id", "imagePath", "material", "meta", "postedById", "postedByName", "seedId", "status", "tag", "title" FROM "ExchangeListing";
DROP TABLE "ExchangeListing";
ALTER TABLE "new_ExchangeListing" RENAME TO "ExchangeListing";
CREATE UNIQUE INDEX "ExchangeListing_seedId_key" ON "ExchangeListing"("seedId");
CREATE TABLE "new_Idea" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "seedId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "impact" TEXT NOT NULL,
    "categories" TEXT NOT NULL,
    "artKey" TEXT NOT NULL,
    "guide" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Idea" ("artKey", "categories", "description", "guide", "id", "impact", "seedId", "tag", "time", "title") SELECT "artKey", "categories", "description", "guide", "id", "impact", "seedId", "tag", "time", "title" FROM "Idea";
DROP TABLE "Idea";
ALTER TABLE "new_Idea" RENAME TO "Idea";
CREATE UNIQUE INDEX "Idea_seedId_key" ON "Idea"("seedId");
CREATE INDEX "Idea_tag_idx" ON "Idea"("tag");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
