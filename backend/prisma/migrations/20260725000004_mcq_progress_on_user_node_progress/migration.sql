-- Add MCQ progress columns to user_node_progress
ALTER TABLE "user_node_progress" ADD COLUMN IF NOT EXISTS "total_sessions" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "user_node_progress" ADD COLUMN IF NOT EXISTS "total_score" INTEGER NOT NULL DEFAULT 0;

-- Drop the separate mcq progress table (superseded by user_node_progress)
DROP TABLE IF EXISTS "user_mcq_node_progress";
