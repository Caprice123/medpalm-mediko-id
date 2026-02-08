-- AlterTable
ALTER TABLE "flashcard_decks" ADD COLUMN "unique_id" TEXT;

-- Generate unique_id for existing records
UPDATE "flashcard_decks" SET "unique_id" = gen_random_uuid()::text WHERE "unique_id" IS NULL;

-- Make unique_id NOT NULL and add unique constraint
ALTER TABLE "flashcard_decks" ALTER COLUMN "unique_id" SET NOT NULL;
ALTER TABLE "flashcard_decks" ALTER COLUMN "unique_id" SET DEFAULT gen_random_uuid()::text;
CREATE UNIQUE INDEX "flashcard_decks_unique_id_key" ON "flashcard_decks"("unique_id");
