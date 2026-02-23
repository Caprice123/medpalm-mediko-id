-- AlterTable: Add media_type field to anatomy_quizzes
ALTER TABLE "anatomy_quizzes" ADD COLUMN IF NOT EXISTS "media_type" TEXT NOT NULL DEFAULT '2d';

-- CreateIndex: Index for efficient filtering by media type
CREATE INDEX IF NOT EXISTS "anatomy_quizzes_media_type_idx" ON "anatomy_quizzes"("media_type");
