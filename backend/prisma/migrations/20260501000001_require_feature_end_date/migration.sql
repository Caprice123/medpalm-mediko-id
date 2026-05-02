-- Make end_date required on user_feature_subscriptions.
-- Safe to run: all NULL rows were removed in migration 20260430000002.
ALTER TABLE "user_feature_subscriptions" ALTER COLUMN "end_date" SET NOT NULL;
