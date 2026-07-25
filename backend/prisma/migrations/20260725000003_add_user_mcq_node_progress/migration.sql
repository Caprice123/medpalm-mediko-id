CREATE TABLE "user_mcq_node_progress" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "node_id" INTEGER NOT NULL,
    "total_sessions" INTEGER NOT NULL DEFAULT 0,
    "total_correct" INTEGER NOT NULL DEFAULT 0,
    "total_answered" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "user_mcq_node_progress_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "user_mcq_node_progress_user_id_node_id_key" ON "user_mcq_node_progress"("user_id", "node_id");
CREATE INDEX "user_mcq_node_progress_user_id_idx" ON "user_mcq_node_progress"("user_id");
CREATE INDEX "user_mcq_node_progress_node_id_idx" ON "user_mcq_node_progress"("node_id");
