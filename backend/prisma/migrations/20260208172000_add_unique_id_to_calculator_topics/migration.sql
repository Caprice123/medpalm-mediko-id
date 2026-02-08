-- AlterTable
ALTER TABLE "calculator_topics" ADD COLUMN "unique_id" TEXT;

-- Generate unique_id for existing records
UPDATE "calculator_topics" SET "unique_id" = gen_random_uuid()::text WHERE "unique_id" IS NULL;

-- Make unique_id NOT NULL and add unique constraint
ALTER TABLE "calculator_topics" ALTER COLUMN "unique_id" SET NOT NULL;
ALTER TABLE "calculator_topics" ALTER COLUMN "unique_id" SET DEFAULT gen_random_uuid()::text;
CREATE UNIQUE INDEX "calculator_topics_unique_id_key" ON "calculator_topics"("unique_id");
