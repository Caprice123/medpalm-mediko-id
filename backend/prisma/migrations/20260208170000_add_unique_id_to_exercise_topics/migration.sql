-- AlterTable
ALTER TABLE "exercise_topics" ADD COLUMN "unique_id" TEXT;

-- Generate unique_id for existing records
UPDATE "exercise_topics" SET "unique_id" = gen_random_uuid()::text WHERE "unique_id" IS NULL;

-- Make unique_id NOT NULL and add unique constraint
ALTER TABLE "exercise_topics" ALTER COLUMN "unique_id" SET NOT NULL;
ALTER TABLE "exercise_topics" ALTER COLUMN "unique_id" SET DEFAULT gen_random_uuid()::text;
CREATE UNIQUE INDEX "exercise_topics_unique_id_key" ON "exercise_topics"("unique_id");
