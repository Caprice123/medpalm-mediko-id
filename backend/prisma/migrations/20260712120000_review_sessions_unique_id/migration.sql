ALTER TABLE "review_sessions" ADD COLUMN "unique_id" TEXT NOT NULL DEFAULT '';
ALTER TABLE "review_sessions" ADD COLUMN "card_ids" TEXT;
CREATE UNIQUE INDEX "review_sessions_unique_id_key" ON "review_sessions"("unique_id");
