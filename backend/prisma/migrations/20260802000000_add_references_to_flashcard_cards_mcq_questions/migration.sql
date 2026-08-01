-- Add references column (array of { label, url? } objects) to flashcard_cards and mcq_questions
ALTER TABLE "flashcard_cards" ADD COLUMN "references" JSONB;
ALTER TABLE "mcq_questions" ADD COLUMN "references" JSONB;
