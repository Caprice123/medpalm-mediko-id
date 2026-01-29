-- AlterTable: Add status column to skripsi_messages
ALTER TABLE "skripsi_messages" ADD COLUMN "status" VARCHAR(20) NOT NULL DEFAULT 'streaming';

-- AlterTable: Add updated_at column to skripsi_messages
ALTER TABLE "skripsi_messages" ADD COLUMN "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex: Add index for status column
CREATE INDEX "skripsi_messages_status_idx" ON "skripsi_messages"("status");

-- Update existing messages to have 'completed' status
UPDATE "skripsi_messages" SET "status" = 'completed' WHERE "status" = 'streaming';

-- Add comment
COMMENT ON COLUMN "skripsi_messages"."status" IS 'Message status: streaming, completed, or truncated';
