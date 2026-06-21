-- Add badge disbursement tracking to challenges
ALTER TABLE "challenges" ADD COLUMN "badges_disbursed" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX "challenges_badges_disbursed_idx" ON "challenges"("badges_disbursed");

-- Add final rank and earned badge to sessions (locked in when challenge ends)
ALTER TABLE "challenge_sessions" ADD COLUMN "earned_badge_id" INTEGER;
ALTER TABLE "challenge_sessions" ADD COLUMN "final_rank" INTEGER;
CREATE INDEX "challenge_sessions_earned_badge_id_idx" ON "challenge_sessions"("earned_badge_id");
