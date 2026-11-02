-- CreateTable
CREATE TABLE "user_osce_tag_statistics" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,
    "session_count" INTEGER NOT NULL DEFAULT 0,
    "total_score" INTEGER NOT NULL DEFAULT 0,
    "max_score" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_osce_tag_statistics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
-- Targeted by the upsert that folds one finalized session into the running totals, so it has to
-- exist before the finalize hook is switched on for a host.
CREATE UNIQUE INDEX "user_osce_tag_statistics_user_id_tag_id_key" ON "user_osce_tag_statistics"("user_id", "tag_id");

-- CreateIndex
CREATE INDEX "user_osce_tag_statistics_user_id_idx" ON "user_osce_tag_statistics"("user_id");
