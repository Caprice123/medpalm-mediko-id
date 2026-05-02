-- Add allowed_features snapshot column to user_purchases
ALTER TABLE "user_purchases" ADD COLUMN "allowed_features" JSONB NOT NULL DEFAULT '[]';
