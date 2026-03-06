ALTER TABLE "mcq_topics" ADD COLUMN "is_deleted" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "mcq_topics" ADD COLUMN "deleted_at" TIMESTAMP(3);
CREATE INDEX "mcq_topics_is_deleted_idx" ON "mcq_topics"("is_deleted");
