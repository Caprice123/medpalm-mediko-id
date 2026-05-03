-- Add quota/disbursement fields to events
ALTER TABLE "events"
  ADD COLUMN "credits_on_approval" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "credit_type" TEXT NOT NULL DEFAULT 'permanent',
  ADD COLUMN "credit_expiry_days" INTEGER,
  ADD COLUMN "duration_days" INTEGER,
  ADD COLUMN "allowed_features" JSONB NOT NULL DEFAULT '[]';

-- Track what was disbursed on each approved registration
ALTER TABLE "event_registrations"
  ADD COLUMN "credits_granted" INTEGER,
  ADD COLUMN "features_granted" JSONB;
