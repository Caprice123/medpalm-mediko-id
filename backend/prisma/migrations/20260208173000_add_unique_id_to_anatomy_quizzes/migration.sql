-- AlterTable
ALTER TABLE "anatomy_quizzes" ADD COLUMN "unique_id" TEXT;

-- Update existing records with UUID
UPDATE "anatomy_quizzes" SET "unique_id" = gen_random_uuid()::text WHERE "unique_id" IS NULL;

-- Make the column NOT NULL
ALTER TABLE "anatomy_quizzes" ALTER COLUMN "unique_id" SET NOT NULL;

-- Set default value for new records
ALTER TABLE "anatomy_quizzes" ALTER COLUMN "unique_id" SET DEFAULT gen_random_uuid()::text;

-- CreateIndex
CREATE UNIQUE INDEX "anatomy_quizzes_unique_id_key" ON "anatomy_quizzes"("unique_id");
