-- Seeds the OSCE hub's two per-user footnote counters into user_feature_statistics.
--
-- No schema change: the table already exists (20260723000002_add_user_feature_statistics). This
-- is a data migration only, and it has to ship with the code that starts reading these rows —
-- GetOsceHubV2Service no longer aggregates osce_sessions for them, so without this seed every
-- user with existing history would read "0 stasiun dinilai / 0 total waktu" until the backfill
-- script was run by hand.
--
-- Counts the same rows the finalize hook increments on: a session is only ever marked
-- 'completed' by the single update in EndOsceSessionService, which writes status and time_taken
-- together.
--
-- time_taken is NOT NULL DEFAULT 0, but COALESCE guards rows written before that default existed.
--
-- ON CONFLICT ... DO UPDATE rather than DO NOTHING: this sets each row to the rebuilt total
-- instead of leaving a stale one in place, which makes re-running it safe and idempotent.
INSERT INTO "user_feature_statistics" ("user_id", "feature", "statistic_type", "statistic_count", "updated_at")
SELECT
  user_id,
  'osce_session',
  'completed_sessions',
  COUNT(*)::int,
  NOW()
FROM "osce_sessions"
WHERE status = 'completed'
GROUP BY user_id

UNION ALL

SELECT
  user_id,
  'osce_session',
  'practice_seconds',
  COALESCE(SUM(COALESCE(time_taken, 0)), 0)::int,
  NOW()
FROM "osce_sessions"
WHERE status = 'completed'
GROUP BY user_id

ON CONFLICT ("user_id", "feature", "statistic_type") DO UPDATE SET
  "statistic_count" = EXCLUDED."statistic_count",
  "updated_at"      = NOW();
