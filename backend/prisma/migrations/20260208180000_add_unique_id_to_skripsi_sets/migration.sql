-- AlterTable
ALTER TABLE "skripsi_sets" ADD COLUMN "unique_id" TEXT;

-- Update existing records with UUID
UPDATE "skripsi_sets" SET "unique_id" = gen_random_uuid()::text WHERE "unique_id" IS NULL;

-- Make the column NOT NULL
ALTER TABLE "skripsi_sets" ALTER COLUMN "unique_id" SET NOT NULL;

-- Set default value for new records
ALTER TABLE "skripsi_sets" ALTER COLUMN "unique_id" SET DEFAULT gen_random_uuid()::text;

-- CreateIndex
CREATE UNIQUE INDEX "skripsi_sets_unique_id_key" ON "skripsi_sets"("unique_id");
