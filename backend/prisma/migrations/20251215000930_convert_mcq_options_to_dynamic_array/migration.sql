-- Convert MCQ options from individual columns to dynamic array

-- Step 1: Add temporary columns
ALTER TABLE "mcq_questions" ADD COLUMN "options_temp" JSONB;
ALTER TABLE "mcq_questions" ADD COLUMN "correct_answer_temp" INTEGER;

-- Step 2: Migrate existing data
-- Convert option_a, option_b, option_c, option_d to JSON array
-- Convert correct_answer from 'a', 'b', 'c', 'd' to 0, 1, 2, 3
UPDATE "mcq_questions"
SET
  "options_temp" = jsonb_build_array(
    "option_a",
    "option_b",
    "option_c",
    "option_d"
  ),
  "correct_answer_temp" = CASE
    WHEN "correct_answer" = 'a' THEN 0
    WHEN "correct_answer" = 'b' THEN 1
    WHEN "correct_answer" = 'c' THEN 2
    WHEN "correct_answer" = 'd' THEN 3
    ELSE 0
  END;

-- Step 3: Update mcq_answers table
-- Convert user_answer from 'a', 'b', 'c', 'd' to 0, 1, 2, 3
ALTER TABLE "mcq_answers" ADD COLUMN "user_answer_temp" INTEGER;

UPDATE "mcq_answers"
SET "user_answer_temp" = CASE
  WHEN "user_answer" = 'a' THEN 0
  WHEN "user_answer" = 'b' THEN 1
  WHEN "user_answer" = 'c' THEN 2
  WHEN "user_answer" = 'd' THEN 3
  ELSE 0
END;

-- Step 4: Drop old columns and rename temp columns in mcq_questions
ALTER TABLE "mcq_questions" DROP COLUMN "option_a";
ALTER TABLE "mcq_questions" DROP COLUMN "option_b";
ALTER TABLE "mcq_questions" DROP COLUMN "option_c";
ALTER TABLE "mcq_questions" DROP COLUMN "option_d";
ALTER TABLE "mcq_questions" DROP COLUMN "correct_answer";

ALTER TABLE "mcq_questions" RENAME COLUMN "options_temp" TO "options";
ALTER TABLE "mcq_questions" RENAME COLUMN "correct_answer_temp" TO "correct_answer";

-- Step 5: Make the new columns NOT NULL
ALTER TABLE "mcq_questions" ALTER COLUMN "options" SET NOT NULL;
ALTER TABLE "mcq_questions" ALTER COLUMN "correct_answer" SET NOT NULL;

-- Step 6: Drop old column and rename temp column in mcq_answers
ALTER TABLE "mcq_answers" DROP COLUMN "user_answer";
ALTER TABLE "mcq_answers" RENAME COLUMN "user_answer_temp" TO "user_answer";
ALTER TABLE "mcq_answers" ALTER COLUMN "user_answer" SET NOT NULL;
