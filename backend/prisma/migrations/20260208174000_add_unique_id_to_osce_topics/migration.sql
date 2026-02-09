-- AlterTable
ALTER TABLE "osce_topics" ADD COLUMN "unique_id" TEXT;

-- Update existing records with UUID
UPDATE "osce_topics" SET "unique_id" = gen_random_uuid()::text WHERE "unique_id" IS NULL;

-- Make the column NOT NULL
ALTER TABLE "osce_topics" ALTER COLUMN "unique_id" SET NOT NULL;

-- Set default value for new records
ALTER TABLE "osce_topics" ALTER COLUMN "unique_id" SET DEFAULT gen_random_uuid()::text;

-- CreateIndex
CREATE UNIQUE INDEX "osce_topics_unique_id_key" ON "osce_topics"("unique_id");
