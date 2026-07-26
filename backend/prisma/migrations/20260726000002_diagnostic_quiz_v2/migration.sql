-- Make quiz_id nullable so questions can exist without a V1 quiz (V2-1 node-based)
ALTER TABLE "diagnostic_questions" ALTER COLUMN "quiz_id" DROP NOT NULL;

-- Add vignette: clinical case description shown above the question
ALTER TABLE "diagnostic_questions" ADD COLUMN "vignette" TEXT;

-- Add image_caption: caption shown below the clinical image
ALTER TABLE "diagnostic_questions" ADD COLUMN "image_caption" TEXT;

-- Backfill vignette from existing quiz descriptions (V1 → V2 data migration)
UPDATE "diagnostic_questions" dq
SET vignette = dqz.description
FROM "diagnostic_quizzes" dqz
WHERE dq.quiz_id = dqz.id
  AND dqz.description IS NOT NULL
  AND dqz.description != '';
