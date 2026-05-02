-- Add start_date and end_date columns
ALTER TABLE user_feature_subscriptions
  ADD COLUMN start_date TIMESTAMP NOT NULL DEFAULT NOW(),
  ADD COLUMN end_date TIMESTAMP;

-- Preserve original grant time
UPDATE user_feature_subscriptions SET start_date = created_at;

-- Existing inactive rows: expire them (end_date = past)
UPDATE user_feature_subscriptions
  SET end_date = NOW() - INTERVAL '1 second'
  WHERE is_active = false;

-- Existing active rows: end_date stays NULL (permanent access)

-- Drop is_active column
ALTER TABLE user_feature_subscriptions DROP COLUMN is_active;

-- Drop unique constraint to allow multiple rows per user-feature
ALTER TABLE user_feature_subscriptions
  DROP CONSTRAINT IF EXISTS user_feature_subscriptions_user_id_feature_key;

-- Drop old is_active index
DROP INDEX IF EXISTS user_feature_subscriptions_is_active_idx;

-- Add date indexes
CREATE INDEX user_feature_subscriptions_start_date_idx ON user_feature_subscriptions(start_date);
CREATE INDEX user_feature_subscriptions_end_date_idx ON user_feature_subscriptions(end_date);
CREATE INDEX user_feature_subscriptions_user_feature_idx ON user_feature_subscriptions(user_id, feature);
