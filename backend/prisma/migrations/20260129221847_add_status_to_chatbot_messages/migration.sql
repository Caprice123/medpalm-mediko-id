-- AlterTable: Add status column to chatbot_messages
ALTER TABLE "chatbot_messages" ADD COLUMN "status" VARCHAR(20) NOT NULL DEFAULT 'completed';

-- CreateIndex: Add index for status column for better query performance
CREATE INDEX "chatbot_messages_status_idx" ON "chatbot_messages"("status");

-- Update existing messages to have 'completed' status
UPDATE "chatbot_messages" SET "status" = 'completed' WHERE "status" IS NULL;

-- Add comment
COMMENT ON COLUMN "chatbot_messages"."status" IS 'Message status: streaming, completed, or truncated';
