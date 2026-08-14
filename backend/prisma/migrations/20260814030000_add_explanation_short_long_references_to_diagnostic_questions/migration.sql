-- Split diagnostic_questions.explanation into short/long fields and add references, mirroring mcq_questions
ALTER TABLE "diagnostic_questions" ADD COLUMN "explanation_short" TEXT;
ALTER TABLE "diagnostic_questions" ADD COLUMN "explanation_long" TEXT;
ALTER TABLE "diagnostic_questions" ADD COLUMN "references" JSONB;

-- Preserve existing admin-authored explanations by moving them into the short slot
UPDATE "diagnostic_questions" SET "explanation_short" = "explanation" WHERE "explanation" IS NOT NULL;
