CREATE TABLE "user_feature_statistics" (
  "user_id"         INTEGER NOT NULL,
  "feature"         TEXT NOT NULL,
  "statistic_type"  TEXT NOT NULL,
  "statistic_count" INTEGER NOT NULL DEFAULT 0,
  "updated_at"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "user_feature_statistics_pkey" PRIMARY KEY ("user_id", "feature", "statistic_type")
);

-- Backfill from existing user_node_progress
INSERT INTO "user_feature_statistics" ("user_id", "feature", "statistic_type", "statistic_count")
SELECT user_id, feature_type, 'again', SUM(again_count) FROM user_node_progress GROUP BY user_id, feature_type
UNION ALL
SELECT user_id, feature_type, 'hard',  SUM(hard_count)  FROM user_node_progress GROUP BY user_id, feature_type
UNION ALL
SELECT user_id, feature_type, 'good',  SUM(good_count)  FROM user_node_progress GROUP BY user_id, feature_type
UNION ALL
SELECT user_id, feature_type, 'easy',  SUM(easy_count)  FROM user_node_progress GROUP BY user_id, feature_type
ON CONFLICT DO NOTHING;
