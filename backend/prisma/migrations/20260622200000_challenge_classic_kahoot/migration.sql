-- Classic mode: replace time_bonus fields with seconds_per_question
-- Base points default raised to 1000 to match Kahoot-style scoring
ALTER TABLE "challenges" ADD COLUMN "seconds_per_question" INTEGER NOT NULL DEFAULT 30;
ALTER TABLE "challenges" DROP COLUMN "time_bonus_pool";
ALTER TABLE "challenges" DROP COLUMN "time_bonus_multiplier";
ALTER TABLE "challenges" ALTER COLUMN "base_points_per_correct" SET DEFAULT 1000;
