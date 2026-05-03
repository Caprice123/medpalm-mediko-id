-- Drop shared duration_days; per-feature duration now lives inside allowed_features JSON
ALTER TABLE "events" DROP COLUMN IF EXISTS "duration_days";
