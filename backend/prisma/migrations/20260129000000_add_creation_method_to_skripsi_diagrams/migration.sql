-- AlterTable
ALTER TABLE "skripsi_diagrams"
ADD COLUMN "creation_method" TEXT NOT NULL DEFAULT 'ai_generated';

-- CreateIndex
CREATE INDEX "skripsi_diagrams_creation_method_idx" ON "skripsi_diagrams"("creation_method");
