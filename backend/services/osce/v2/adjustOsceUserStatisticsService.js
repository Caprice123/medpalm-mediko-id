import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import {
  OSCE_STATS_FEATURE,
  OSCE_STAT_COMPLETED_SESSIONS,
  OSCE_STAT_PRACTICE_SECONDS,
} from '#services/osce/v2/osceUserStatisticsKeys'

// Folds one finalized session into the two per-user totals the hub rail footnotes read, so the
// hub never has to count or sum the session rows to render them.
//
// Unlike AdjustOsceTagStatisticsService this is NOT behind the performance-stats rollout flag.
// That one is optional because the chart it feeds has a derived fallback that reads the sessions
// directly; these two counters are the only source for their footnotes, so a user whose
// increments were skipped would read 0 for work they actually did.
//
// Exact rather than approximate, because `osce_sessions` has exactly one write path that sets
// `status = 'completed'` and `time_taken` — the single update in EndOsceSessionService. Nothing
// else in the codebase marks a session completed, so there is no second path for these numbers
// to drift behind. If that ever stops being true, this has to be called there too, or the
// backfill script run to repair.
export class AdjustOsceUserStatisticsService extends BaseService {
  static async call({ userId, timeTaken = 0 }) {
    if (!userId) return { skipped: true }

    // A session that never started has no seconds to add, but it still counts as finalized —
    // so the seconds row is written at 0 rather than left absent, which keeps the two rows in
    // step and makes the backfill's rebuild match increment-for-increment.
    const seconds = Number.isFinite(timeTaken) && timeTaken > 0 ? Math.round(timeTaken) : 0

    const upsert = (statisticType, amount) => prisma.user_feature_statistics.upsert({
      where: {
        user_id_feature_statistic_type: {
          user_id: userId,
          feature: OSCE_STATS_FEATURE,
          statistic_type: statisticType,
        },
      },
      create: {
        user_id: userId,
        feature: OSCE_STATS_FEATURE,
        statistic_type: statisticType,
        statistic_count: amount,
      },
      update: { statistic_count: { increment: amount } },
    })

    // One transaction: a footnote reading "19 kasus" beside a total time that only covers 18
    // of them is worse than both being one session behind.
    await prisma.$transaction([
      upsert(OSCE_STAT_COMPLETED_SESSIONS, 1),
      upsert(OSCE_STAT_PRACTICE_SECONDS, seconds),
    ])

    return { skipped: false, seconds }
  }
}
