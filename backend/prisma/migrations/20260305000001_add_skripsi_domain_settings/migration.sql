-- CreateTable: skripsi_research_domains
CREATE TABLE "skripsi_research_domains" (
    "id" SERIAL NOT NULL,
    "domain" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "skripsi_research_domains_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "skripsi_research_domains_domain_key" ON "skripsi_research_domains"("domain");
CREATE INDEX "skripsi_research_domains_is_active_idx" ON "skripsi_research_domains"("is_active");

-- AlterTable: add domain settings columns to skripsi_sets
ALTER TABLE "skripsi_sets"
    ADD COLUMN IF NOT EXISTS "selected_domains" JSONB NOT NULL DEFAULT '[]',
    ADD COLUMN IF NOT EXISTS "domain_filter_enabled" BOOLEAN NOT NULL DEFAULT true;
