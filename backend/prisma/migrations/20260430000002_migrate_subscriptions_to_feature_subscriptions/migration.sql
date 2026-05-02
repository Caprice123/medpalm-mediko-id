-- ============================================================
-- Fix: drop the unique INDEX (Prisma created it as CREATE UNIQUE INDEX,
-- not ADD CONSTRAINT, so DROP CONSTRAINT in the previous migration was a no-op)
-- ============================================================
DROP INDEX IF EXISTS "user_feature_subscriptions_user_id_feature_key";

-- ============================================================
-- Migrate existing user_subscriptions into user_feature_subscriptions
-- ============================================================

-- Step 1: Remove the permanent (end_date IS NULL) rows that were
-- auto-created by the previous migration from old boolean is_active flags.
-- These will be replaced with proper dated rows from subscription history.
DELETE FROM user_feature_subscriptions WHERE end_date IS NULL;

-- Step 2: For subscriptions tied to a pricing plan that has allowed_features,
-- insert one row per feature using the subscription's own start_date / end_date.
INSERT INTO user_feature_subscriptions (user_id, feature, start_date, end_date, created_at, updated_at)
SELECT
  us.user_id,
  feature_val,
  us.start_date,
  us.end_date,
  NOW(),
  NOW()
FROM user_subscriptions us
JOIN pricing_plans pp ON us.pricing_plan_id = pp.id
CROSS JOIN LATERAL jsonb_array_elements_text(pp.allowed_features) AS feature_val
WHERE jsonb_typeof(pp.allowed_features) = 'array'
  AND jsonb_array_length(pp.allowed_features) > 0;

-- Step 3: For subscriptions with no pricing_plan (manually added by admin),
-- grant all 11 features using the subscription's start_date / end_date.
INSERT INTO user_feature_subscriptions (user_id, feature, start_date, end_date, created_at, updated_at)
SELECT
  us.user_id,
  f.feature,
  us.start_date,
  us.end_date,
  NOW(),
  NOW()
FROM user_subscriptions us
CROSS JOIN (VALUES
  ('exercise'),
  ('flashcard'),
  ('calculator'),
  ('diagnostic'),
  ('anatomy'),
  ('mcq'),
  ('chatbot'),
  ('skripsi_builder'),
  ('osce_practice'),
  ('summary_notes'),
  ('atlas')
) AS f(feature)
WHERE us.pricing_plan_id IS not NULL;
