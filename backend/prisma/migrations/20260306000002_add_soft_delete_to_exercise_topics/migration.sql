ALTER TABLE "exercise_topics" ADD COLUMN "is_deleted" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "exercise_topics" ADD COLUMN "deleted_at" TIMESTAMP(3);
CREATE INDEX "exercise_topics_is_deleted_idx" ON "exercise_topics"("is_deleted");
