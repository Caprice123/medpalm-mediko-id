CREATE TABLE "user_node_progress" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "node_id" INTEGER NOT NULL,
    "feature_type" TEXT NOT NULL,
    "again_count" INTEGER NOT NULL DEFAULT 0,
    "hard_count" INTEGER NOT NULL DEFAULT 0,
    "good_count" INTEGER NOT NULL DEFAULT 0,
    "easy_count" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_node_progress_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "user_node_progress_user_id_node_id_feature_type_key" ON "user_node_progress"("user_id", "node_id", "feature_type");
CREATE INDEX "user_node_progress_user_id_feature_type_idx" ON "user_node_progress"("user_id", "feature_type");
