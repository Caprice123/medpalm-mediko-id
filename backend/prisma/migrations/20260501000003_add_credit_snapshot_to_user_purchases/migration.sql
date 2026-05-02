ALTER TABLE "user_purchases"
  ADD COLUMN "credits_included"   INTEGER,
  ADD COLUMN "credit_type"        TEXT,
  ADD COLUMN "credit_expiry_days" INTEGER;
