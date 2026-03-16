-- Add journal_name column to chatbot_research_domains
-- Used by OpenAlex V3 research mode as journal/source filter
ALTER TABLE "chatbot_research_domains" ADD COLUMN "journal_name" TEXT NOT NULL DEFAULT '';

-- Add journal_name column to skripsi_research_domains as well for consistency
ALTER TABLE "skripsi_research_domains" ADD COLUMN "journal_name" TEXT NOT NULL DEFAULT '';
