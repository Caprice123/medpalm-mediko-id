-- AlterTable
ALTER TABLE "summary_notes" ADD COLUMN "unique_id" TEXT;

-- Update existing records with UUID
UPDATE "summary_notes" SET "unique_id" = gen_random_uuid()::text WHERE "unique_id" IS NULL;

-- Make the column NOT NULL
ALTER TABLE "summary_notes" ALTER COLUMN "unique_id" SET NOT NULL;

-- Set default value for new records
ALTER TABLE "summary_notes" ALTER COLUMN "unique_id" SET DEFAULT gen_random_uuid()::text;

-- CreateIndex
CREATE UNIQUE INDEX "summary_notes_unique_id_key" ON "summary_notes"("unique_id");
