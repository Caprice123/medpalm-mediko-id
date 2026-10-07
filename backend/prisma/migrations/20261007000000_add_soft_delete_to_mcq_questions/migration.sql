-- AlterTable
ALTER TABLE "mcq_questions" ADD COLUMN "is_deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "deleted_at" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "mcq_questions_is_deleted_idx" ON "mcq_questions"("is_deleted");
