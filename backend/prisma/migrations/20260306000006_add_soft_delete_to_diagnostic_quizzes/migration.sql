ALTER TABLE "diagnostic_quizzes" ADD COLUMN "is_deleted" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "diagnostic_quizzes" ADD COLUMN "deleted_at" TIMESTAMP(3);
CREATE INDEX "diagnostic_quizzes_is_deleted_idx" ON "diagnostic_quizzes"("is_deleted");
