-- Remove unique constraint on user_credits.user_id (one user can now have many credit buckets)
ALTER TABLE "user_credits" DROP CONSTRAINT IF EXISTS "user_credits_user_id_key";

-- Add credit_type and expires_at to user_credits
ALTER TABLE "user_credits" ADD COLUMN "credit_type" TEXT NOT NULL DEFAULT 'permanent';
ALTER TABLE "user_credits" ADD COLUMN "expires_at" TIMESTAMP(3);

-- Add new indexes on user_credits
CREATE INDEX "user_credits_user_id_credit_type_idx" ON "user_credits"("user_id", "credit_type");
CREATE INDEX "user_credits_expires_at_idx" ON "user_credits"("expires_at");

-- Add credit_type and credit_expiry_days to pricing_plans
ALTER TABLE "pricing_plans" ADD COLUMN "credit_type" TEXT NOT NULL DEFAULT 'permanent';
ALTER TABLE "pricing_plans" ADD COLUMN "credit_expiry_days" INTEGER;
