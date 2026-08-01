-- Add references column (array of { label, url? } objects) to challenge_questions
ALTER TABLE "challenge_questions" ADD COLUMN "references" JSONB;
