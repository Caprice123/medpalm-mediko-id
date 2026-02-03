-- Remove is_active column and indexes from feature tables

-- Drop indexes first
DROP INDEX IF EXISTS "exercise_topics_is_active_idx";
DROP INDEX IF EXISTS "tags_is_active_idx";
DROP INDEX IF EXISTS "flashcard_decks_is_active_idx";
DROP INDEX IF EXISTS "summary_notes_is_active_idx";
DROP INDEX IF EXISTS "calculator_topics_is_active_idx";
DROP INDEX IF EXISTS "anatomy_quizzes_is_active_idx";
DROP INDEX IF EXISTS "mcq_topics_is_active_idx";
DROP INDEX IF EXISTS "osce_topics_is_active_idx";

-- Drop columns
ALTER TABLE "exercise_topics" DROP COLUMN IF EXISTS "is_active";
ALTER TABLE "tags" DROP COLUMN IF EXISTS "is_active";
ALTER TABLE "flashcard_decks" DROP COLUMN IF EXISTS "is_active";
ALTER TABLE "summary_notes" DROP COLUMN IF EXISTS "is_active";
ALTER TABLE "calculator_topics" DROP COLUMN IF EXISTS "is_active";
ALTER TABLE "anatomy_quizzes" DROP COLUMN IF EXISTS "is_active";
ALTER TABLE "mcq_topics" DROP COLUMN IF EXISTS "is_active";
ALTER TABLE "osce_topics" DROP COLUMN IF EXISTS "is_active";
