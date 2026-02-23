-- AlterTable: Add embed_url field to anatomy_quizzes
ALTER TABLE "anatomy_quizzes" ADD COLUMN IF NOT EXISTS "embed_url" TEXT;

-- Comment: This migration adds embed URL support to anatomy quizzes
-- Allows admins to use an external embed link (e.g. BioDigital Human) as an
-- alternative to uploading an image file.
