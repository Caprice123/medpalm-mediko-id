ALTER TABLE "calculator_topics" ADD COLUMN "is_deleted" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "calculator_topics" ADD COLUMN "deleted_at" TIMESTAMP(3);
CREATE INDEX "calculator_topics_is_deleted_idx" ON "calculator_topics"("is_deleted");
