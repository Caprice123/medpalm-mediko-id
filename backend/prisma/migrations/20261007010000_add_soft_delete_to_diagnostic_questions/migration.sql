-- AlterTable
ALTER TABLE "diagnostic_questions" ADD COLUMN "is_deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "deleted_at" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "diagnostic_questions_is_deleted_idx" ON "diagnostic_questions"("is_deleted");
