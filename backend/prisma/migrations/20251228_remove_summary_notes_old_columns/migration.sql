-- Migration: Remove old source file columns from summary_notes table
-- These columns are replaced by the centralized blob/attachment system

-- Remove old source file columns
ALTER TABLE "summary_notes" DROP COLUMN IF EXISTS "source_type";
ALTER TABLE "summary_notes" DROP COLUMN IF EXISTS "source_url";
ALTER TABLE "summary_notes" DROP COLUMN IF EXISTS "source_key";
ALTER TABLE "summary_notes" DROP COLUMN IF EXISTS "source_filename";
