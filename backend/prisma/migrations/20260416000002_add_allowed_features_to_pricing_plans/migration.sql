-- Add allowed_features column to pricing_plans
ALTER TABLE "pricing_plans" ADD COLUMN "allowed_features" JSONB NOT NULL DEFAULT '[]';
