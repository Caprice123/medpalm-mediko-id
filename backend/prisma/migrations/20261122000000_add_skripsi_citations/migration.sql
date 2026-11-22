-- AlterTable: the citation style a report generates its daftar pustaka in,
-- remembered so the next generate does not switch style on the student.
ALTER TABLE "skripsi_sets" ADD COLUMN "citation_style" TEXT NOT NULL DEFAULT 'vancouver';

-- CreateTable: the sources a student kept for the daftar pustaka. A Searcher
-- result only carries a title, a URL and a date, so what Crossref/PubMed knows
-- about the URL is resolved once on save and stored here; the bibliography is
-- then formatted from these columns in whichever style is asked for.
CREATE TABLE "skripsi_citations" (
    "id" SERIAL NOT NULL,
    "set_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "source_type" TEXT NOT NULL DEFAULT 'web',
    -- [{ family, given }] in citation order; each style prints a name differently
    "authors" JSONB,
    "container_title" TEXT,
    "publisher" TEXT,
    "volume" TEXT,
    "issue" TEXT,
    "pages" TEXT,
    "doi" TEXT,
    "pmid" TEXT,
    "published_year" TEXT,
    "published_date" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "accessed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "skripsi_citations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex: one report cannot keep the same URL twice, so saving a result
-- that is already in the list is an update rather than a duplicate entry.
CREATE UNIQUE INDEX "skripsi_citations_set_id_url_key" ON "skripsi_citations"("set_id", "url");
CREATE INDEX "skripsi_citations_set_id_idx" ON "skripsi_citations"("set_id");
CREATE INDEX "skripsi_citations_position_idx" ON "skripsi_citations"("position");

-- NOTE: the schema runs with relationMode = "prisma", so relations are enforced
-- by the client rather than by database foreign keys — only the indexes above
-- are created, matching every other migration in this project.
