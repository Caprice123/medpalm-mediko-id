-- DropColumn: Remove pdf_url, pdf_key, pdf_filename from flashcard_decks
-- These columns are replaced by the blob/attachment system

-- AlterTable: flashcard_decks
ALTER TABLE "flashcard_decks" DROP COLUMN IF EXISTS "pdf_url";
ALTER TABLE "flashcard_decks" DROP COLUMN IF EXISTS "pdf_key";
ALTER TABLE "flashcard_decks" DROP COLUMN IF EXISTS "pdf_filename";

-- AlterTable: exercise_topics
ALTER TABLE "exercise_topics" DROP COLUMN IF EXISTS "pdf_url";
ALTER TABLE "exercise_topics" DROP COLUMN IF EXISTS "pdf_key";
ALTER TABLE "exercise_topics" DROP COLUMN IF EXISTS "pdf_filename";
