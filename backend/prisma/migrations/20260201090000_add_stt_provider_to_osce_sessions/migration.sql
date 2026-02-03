-- Add metadata column to osce_sessions table for flexible session data storage
ALTER TABLE "osce_sessions" ADD COLUMN "metadata" JSONB;
