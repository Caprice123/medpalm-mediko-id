-- Remove PDF URL columns from flashcard_decks and exercise_topics
-- These columns are now replaced by the blob/attachment system

BEGIN;

-- Remove columns from flashcard_decks
ALTER TABLE flashcard_decks DROP COLUMN IF EXISTS pdf_url;
ALTER TABLE flashcard_decks DROP COLUMN IF EXISTS pdf_key;
ALTER TABLE flashcard_decks DROP COLUMN IF EXISTS pdf_filename;

-- Remove columns from exercise_topics
ALTER TABLE exercise_topics DROP COLUMN IF EXISTS pdf_url;
ALTER TABLE exercise_topics DROP COLUMN IF EXISTS pdf_key;
ALTER TABLE exercise_topics DROP COLUMN IF EXISTS pdf_filename;

COMMIT;

-- Verification queries (run these to verify the columns were dropped):
-- SELECT column_name FROM information_schema.columns WHERE table_name = 'flashcard_decks';
-- SELECT column_name FROM information_schema.columns WHERE table_name = 'exercise_topics';
