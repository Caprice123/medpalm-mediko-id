-- Add max_special_per_session to challenges
ALTER TABLE "challenges" ADD COLUMN "max_special_per_session" INTEGER NOT NULL DEFAULT 0;

-- Add is_special to challenge_questions
ALTER TABLE "challenge_questions" ADD COLUMN "is_special" BOOLEAN NOT NULL DEFAULT FALSE;

-- Make question nullable (image-only questions allowed)
ALTER TABLE "challenge_questions" ALTER COLUMN "question" DROP NOT NULL;
