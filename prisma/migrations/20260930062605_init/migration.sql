-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'en',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tokenHash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "revoked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Scan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "material" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "confidence" INTEGER NOT NULL,
    "detectedSummary" TEXT NOT NULL,
    "condition" TEXT NOT NULL,
    "estimatedSize" TEXT NOT NULL,
    "tipTitle" TEXT NOT NULL,
    "tipBody" TEXT NOT NULL,
    "recommendations" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Scan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ExchangeListing" (
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
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'available',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ExchangeListing_postedById_fkey" FOREIGN KEY ("postedById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ExchangeInterest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "listingId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "message" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ExchangeInterest_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "ExchangeListing" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ActivityEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "artKey" TEXT NOT NULL,
    "occurredAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ActivityEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AssistantMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "text" TEXT,
    "ideas" JSONB,
    "locale" TEXT NOT NULL DEFAULT 'en',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AssistantMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Idea" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "seedId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "impact" TEXT NOT NULL,
    "categories" TEXT NOT NULL,
    "artKey" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "IdempotencyRecord" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "endpoint" TEXT NOT NULL,
    "requestBody" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "responseBody" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_tokenHash_key" ON "RefreshToken"("tokenHash");

-- CreateIndex
CREATE INDEX "RefreshToken_userId_idx" ON "RefreshToken"("userId");

-- CreateIndex
CREATE INDEX "Scan_userId_createdAt_idx" ON "Scan"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ExchangeListing_seedId_key" ON "ExchangeListing"("seedId");

-- CreateIndex
CREATE UNIQUE INDEX "ExchangeInterest_listingId_userId_key" ON "ExchangeInterest"("listingId", "userId");

-- CreateIndex
CREATE INDEX "ActivityEntry_userId_occurredAt_idx" ON "ActivityEntry"("userId", "occurredAt");

-- CreateIndex
CREATE INDEX "AssistantMessage_userId_createdAt_idx" ON "AssistantMessage"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Idea_seedId_key" ON "Idea"("seedId");

-- CreateIndex
CREATE INDEX "Idea_tag_idx" ON "Idea"("tag");

-- CreateIndex
CREATE INDEX "IdempotencyRecord_userId_endpoint_idx" ON "IdempotencyRecord"("userId", "endpoint");
