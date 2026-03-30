-- AlterTable
ALTER TABLE "user_subscriptions" ADD COLUMN "pricing_plan_id" INTEGER;

-- CreateIndex
CREATE INDEX "user_subscriptions_pricing_plan_id_idx" ON "user_subscriptions"("pricing_plan_id");
