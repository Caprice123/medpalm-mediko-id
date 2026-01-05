-- AlterTable
ALTER TABLE "pricing_plans" ADD COLUMN "allowed_payment_method" TEXT NOT NULL DEFAULT 'xendit';
