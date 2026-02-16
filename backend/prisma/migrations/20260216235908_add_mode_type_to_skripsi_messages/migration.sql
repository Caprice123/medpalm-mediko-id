-- AlterTable: Add mode_type field to skripsi_messages
ALTER TABLE "skripsi_messages" ADD COLUMN IF NOT EXISTS "mode_type" TEXT NOT NULL DEFAULT 'research';

-- CreateIndex: Add index on mode_type for better query performance
CREATE INDEX IF NOT EXISTS "skripsi_messages_mode_type_idx" ON "skripsi_messages"("mode_type");

-- Comment: This migration adds mode type support to skripsi messages
-- Allows tracking whether a message was created in 'research' or 'validated' mode
