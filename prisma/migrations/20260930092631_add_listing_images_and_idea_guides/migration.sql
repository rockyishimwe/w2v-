-- AlterTable
ALTER TABLE "Idea" ADD COLUMN "guide" JSONB;

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
    "distanceKm" REAL,
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
INSERT INTO "new_ExchangeListing" ("category", "condition", "createdAt", "distanceKm", "district", "featured", "id", "material", "meta", "postedById", "postedByName", "seedId", "status", "tag", "title") SELECT "category", "condition", "createdAt", "distanceKm", "district", "featured", "id", "material", "meta", "postedById", "postedByName", "seedId", "status", "tag", "title" FROM "ExchangeListing";
DROP TABLE "ExchangeListing";
ALTER TABLE "new_ExchangeListing" RENAME TO "ExchangeListing";
CREATE UNIQUE INDEX "ExchangeListing_seedId_key" ON "ExchangeListing"("seedId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
