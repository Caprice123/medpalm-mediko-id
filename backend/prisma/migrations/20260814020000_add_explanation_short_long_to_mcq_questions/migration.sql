-- Split mcq_questions.explanation into short/long fields, mirroring flashcard_cards
ALTER TABLE "mcq_questions" ADD COLUMN "explanation_short" TEXT;
ALTER TABLE "mcq_questions" ADD COLUMN "explanation_long" TEXT;

-- Preserve existing admin-authored explanations by moving them into the short slot
UPDATE "mcq_questions" SET "explanation_short" = "explanation" WHERE "explanation" IS NOT NULL;
