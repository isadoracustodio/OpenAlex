-- CreateTable
CREATE TABLE "Work" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "doi" TEXT,
    "title" TEXT,
    "year" INTEGER,
    "type" TEXT,
    "language" TEXT,
    "sourceName" TEXT,
    "oaStatus" TEXT,
    "citations" INTEGER NOT NULL DEFAULT 0,
    "topic" TEXT,
    "isXpac" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "Author" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "orcid" TEXT
);

-- CreateTable
CREATE TABLE "Institution" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "ror" TEXT,
    "countryCode" TEXT
);

-- CreateTable
CREATE TABLE "Authorship" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "workId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "position" TEXT,
    CONSTRAINT "Authorship_workId_fkey" FOREIGN KEY ("workId") REFERENCES "Work" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Authorship_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AuthorshipInstitution" (
    "authorshipId" INTEGER NOT NULL,
    "institutionId" TEXT NOT NULL,

    PRIMARY KEY ("authorshipId", "institutionId"),
    CONSTRAINT "AuthorshipInstitution_authorshipId_fkey" FOREIGN KEY ("authorshipId") REFERENCES "Authorship" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AuthorshipInstitution_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Work_year_idx" ON "Work"("year");

-- CreateIndex
CREATE INDEX "Institution_countryCode_idx" ON "Institution"("countryCode");
