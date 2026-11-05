import { PrismaClient } from '@prisma/client';
import {
  OSCE_STATS_FEATURE,
  OSCE_STAT_COMPLETED_SESSIONS,
  OSCE_STAT_PRACTICE_SECONDS,
} from '#services/osce/v2/osceUserStatisticsKeys';

const prisma = new PrismaClient();

// Rebuilds the OSCE hub's two per-user footnote counters in user_feature_statistics from the
// sessions that already exist.
//
// The same statement the 20261105010000_backfill_osce_user_statistics migration runs. That
// migration is the seed; this is the repair tool, for when an increment is lost — finalize
// swallows a counter failure on purpose rather than costing the user the result they just
// earned, so a failed write leaves the row one session behind with nothing to notice it.
//
// Idempotent: every row is REBUILT from the sessions rather than incremented, so running it
// twice gives the same numbers, and running it on a healthy database changes nothing.
//
// The feature/type keys are bound parameters, cast to text: they sit in the target list of a
// UNION, where Postgres has no destination column at hand to infer a bare parameter's type from.
//
// Keyed on exactly what the finalize hook increments on — sessions marked 'completed', which
// only EndOsceSessionService's single update ever does, writing status and time_taken together.
async function main() {
  try {
    const result = await prisma.$executeRaw`
      INSERT INTO user_feature_statistics (user_id, feature, statistic_type, statistic_count, updated_at)
      SELECT user_id, ${OSCE_STATS_FEATURE}::text, ${OSCE_STAT_COMPLETED_SESSIONS}::text, COUNT(*)::int, NOW()
      FROM osce_sessions
      WHERE status = 'completed'
      GROUP BY user_id
      UNION ALL
      SELECT user_id, ${OSCE_STATS_FEATURE}::text, ${OSCE_STAT_PRACTICE_SECONDS}::text, COALESCE(SUM(COALESCE(time_taken, 0)), 0)::int, NOW()
      FROM osce_sessions
      WHERE status = 'completed'
      GROUP BY user_id
      ON CONFLICT (user_id, feature, statistic_type) DO UPDATE SET
        statistic_count = EXCLUDED.statistic_count,
        updated_at      = NOW()
    `;

    console.log(`Rebuilt ${result} user_feature_statistics rows for ${OSCE_STATS_FEATURE}`);
  } catch (error) {
    console.error('Error:', error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();
