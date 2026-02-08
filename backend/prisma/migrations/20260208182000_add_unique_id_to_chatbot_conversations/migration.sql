-- AlterTable
ALTER TABLE "chatbot_conversations" ADD COLUMN "unique_id" TEXT;

-- Generate UUIDs for existing records
UPDATE "chatbot_conversations" SET "unique_id" = gen_random_uuid()::text WHERE "unique_id" IS NULL;

-- Make unique_id NOT NULL and add unique constraint
ALTER TABLE "chatbot_conversations" ALTER COLUMN "unique_id" SET NOT NULL;
ALTER TABLE "chatbot_conversations" ALTER COLUMN "unique_id" SET DEFAULT gen_random_uuid()::text;

-- CreateIndex
CREATE UNIQUE INDEX "chatbot_conversations_unique_id_key" ON "chatbot_conversations"("unique_id");
