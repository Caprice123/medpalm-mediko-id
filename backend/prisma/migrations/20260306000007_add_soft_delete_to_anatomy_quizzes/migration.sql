ALTER TABLE "anatomy_quizzes" ADD COLUMN "is_deleted" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "anatomy_quizzes" ADD COLUMN "deleted_at" TIMESTAMP(3);
CREATE INDEX "anatomy_quizzes_is_deleted_idx" ON "anatomy_quizzes"("is_deleted");
