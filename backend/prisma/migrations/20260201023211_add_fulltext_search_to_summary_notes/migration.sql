-- Drop old indexes if they exist
DROP INDEX IF EXISTS "summary_notes_title_idx";
DROP INDEX IF EXISTS "summary_notes_title_gin_idx";

-- Enable pg_trgm extension for trigram matching
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Add composite GIN indexes with trigram ops for fast ILIKE searches on multiple columns

-- Summary Notes (title + description composite)
DROP INDEX IF EXISTS "summary_notes_title_gin_trgm_idx";
CREATE INDEX IF NOT EXISTS "summary_notes_search_gin_idx" ON "summary_notes" USING GIN ("title" gin_trgm_ops, "description" gin_trgm_ops);

-- Anatomy Quizzes (title + description composite)
CREATE INDEX IF NOT EXISTS "anatomy_quizzes_search_gin_idx" ON "anatomy_quizzes" USING GIN ("title" gin_trgm_ops, "description" gin_trgm_ops);

-- MCQ Topics (title + description composite)
CREATE INDEX IF NOT EXISTS "mcq_topics_search_gin_idx" ON "mcq_topics" USING GIN ("title" gin_trgm_ops, "description" gin_trgm_ops);

-- Skripsi Sets (title + description composite)
CREATE INDEX IF NOT EXISTS "skripsi_sets_search_gin_idx" ON "skripsi_sets" USING GIN ("title" gin_trgm_ops, "description" gin_trgm_ops);

-- OSCE Topics (title + description + scenario composite)
CREATE INDEX IF NOT EXISTS "osce_topics_search_gin_idx" ON "osce_topics" USING GIN ("title" gin_trgm_ops, "description" gin_trgm_ops, "scenario" gin_trgm_ops);

-- Calculator Topics (title + description composite)
DROP INDEX IF EXISTS "calculator_topics_title_gin_trgm_idx";
CREATE INDEX IF NOT EXISTS "calculator_topics_search_gin_idx" ON "calculator_topics" USING GIN ("title" gin_trgm_ops, "description" gin_trgm_ops);

-- Exercise Topics (title + description composite)
CREATE INDEX IF NOT EXISTS "exercise_topics_search_gin_idx" ON "exercise_topics" USING GIN ("title" gin_trgm_ops, "description" gin_trgm_ops);

-- Flashcard Decks (title + description composite)
CREATE INDEX IF NOT EXISTS "flashcard_decks_search_gin_idx" ON "flashcard_decks" USING GIN ("title" gin_trgm_ops, "description" gin_trgm_ops);
