ALTER TABLE "user_node_progress" RENAME COLUMN "total_score" TO "total_correct";
ALTER TABLE "user_node_progress" ADD COLUMN "total_questions" INTEGER NOT NULL DEFAULT 0;
