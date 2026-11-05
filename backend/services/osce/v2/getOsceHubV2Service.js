import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import { remainingSecondsFor, scorePercentage } from '#utils/osceSessionTiming'
import {
  OSCE_STATS_FEATURE,
  OSCE_STAT_COMPLETED_SESSIONS,
  OSCE_STAT_PRACTICE_SECONDS,
} from '#services/osce/v2/osceUserStatisticsKeys'

// Everything the OSCE hub's left rail needs in one read: the session the student should resume,
// how many stations have been marked, and the last one that was.
//
// The two footnote totals come from `user_feature_statistics`, not from aggregating the session
// rows. They are maintained at finalize — see AdjustOsceUserStatisticsService for why that is
// exact here and not an approximation.
//
// The rail leads with "lanjutkan atau mulai" (the user's call this round), so the shape is built
// around one `resumable` session rather than a list: a student is in at most one station at a
// time in practice, and a rail that stacks three live blocks has no lead.
export class GetOsceHubV2Service extends BaseService {
  static async call(userId) {
    if (!userId) {
      throw new ValidationError('ID pengguna wajib diisi')
    }

    const [resumable, statistics, lastScored] = await Promise.all([
      this._resumableSession(userId),
      this._statistics(userId),
      this._lastScoredSession(userId),
    ])

    return {
      resumable,
      completedCount: statistics.completedCount,
      lastResult: lastScored,
      totalPracticeSeconds: statistics.totalPracticeSeconds,
    }
  }

  // The rail's two footnotes, read rather than computed. Both used to aggregate `osce_sessions`
  // — a count and a SUM(time_taken) over the same rows, as two separate queries — and are now
  // maintained at finalize by AdjustOsceUserStatisticsService.
  //
  // A missing row means zero for real: every user who had history when this moved to counters
  // was seeded by the 20261105010000_backfill_osce_user_statistics migration, so the only way to
  // have no row is to have never finished a session. scripts/backfillOsceUserStatistics.js
  // rebuilds both rows from the sessions if an increment is ever lost.
  static async _statistics(userId) {
    const rows = await prisma.user_feature_statistics.findMany({
      where: { user_id: userId, feature: OSCE_STATS_FEATURE },
      select: { statistic_type: true, statistic_count: true },
    })

    const countByType = Object.fromEntries(rows.map((row) => [row.statistic_type, row.statistic_count]))

    return {
      completedCount: countByType[OSCE_STAT_COMPLETED_SESSIONS] ?? 0,
      totalPracticeSeconds: countByType[OSCE_STAT_PRACTICE_SECONDS] ?? 0,
    }
  }

  // The one session the rail leads with, fetched as one row rather than found inside a list.
  //
  // Priority: a station still running, then one whose bell has rung but was never marked, then
  // one created and never opened. A running station outranks a created one even when the
  // created one is newer, because it has a clock going against it and losing it costs the
  // student the attempt; an expired one outranks a created one for the same reason, since it
  // holds real answers waiting to be marked while a created session holds nothing yet.
  //
  // Asked as up to three LIMIT 1 queries, short-circuiting on the first hit, rather than one
  // read of every unfinished session. This used to load them all and filter in JS, on the
  // assumption — written into the comment here — that there were "only ever a handful per
  // user". That is not true: abandoned sessions accumulate (a created session is written before
  // the start gate's checks, and nothing sweeps the ones that are never started), and real
  // accounts carry dozens. Each row drags its topic snapshot and every tag snapshot with it,
  // so the old shape paid that join cost dozens of times over to keep exactly one row.
  //
  // The predicates are the SQL spelling of isExpired(): a started session is live while its
  // scheduled end is still ahead. A started row with no scheduled end at all has no clock to
  // read and counts as expired, which is what remainingSecondsFor() returns for it too.
  //
  // The two cannot disagree in a way that matters. If the bell rings in the milliseconds
  // between this query and the response, the session arrives as "live" with remainingSeconds 0
  // — and the rail derives "Waktu habis" from that number, not from a flag, so it still renders
  // correctly.
  static async _resumableSession(userId) {
    const now = new Date()

    const running = await this._findUnfinished({
      user_id: userId,
      status: 'started',
      scheduled_end_at: { gt: now },
    })
    if (running) return running

    const expired = await this._findUnfinished({
      user_id: userId,
      status: 'started',
      OR: [
        { scheduled_end_at: { lte: now } },
        { scheduled_end_at: null },
      ],
    })
    if (expired) return expired

    return this._findUnfinished({ user_id: userId, status: 'created' })
  }

  // Newest first within whichever bucket matched: of two sessions the student could resume, the
  // one they opened most recently is the one they meant.
  static async _findUnfinished(where) {
    const session = await prisma.osce_sessions.findFirst({
      where,
      orderBy: { id: 'desc' },
      include: {
        osce_session_topic_snapshot: true,
        osce_session_tag_snapshots: {
          include: { tags: { include: { tag_group: true } } },
        },
      },
    })

    if (!session) return null

    const snapshot = session.osce_session_topic_snapshot
    const durationMinutes = snapshot?.duration_minutes || 0

    return {
      uniqueId: session.unique_id,
      status: session.status,
      topicTitle: snapshot?.title || 'Kasus tanpa judul',
      scenario: snapshot?.scenario || null,
      durationMinutes,
      remainingSeconds: remainingSecondsFor(session, durationMinutes),
      startedAt: session.started_at,
      tags: session.osce_session_tag_snapshots.map((tagSnapshot) => ({
        id: tagSnapshot.tag_id,
        name: tagSnapshot.tags.name,
        groupName: tagSnapshot.tags.tag_group?.name || null,
      })),
    }
  }

  static async _lastScoredSession(userId) {
    const session = await prisma.osce_sessions.findFirst({
      where: {
        user_id: userId,
        status: 'completed',
        total_score: { not: null },
        max_score: { gt: 0 },
      },
      include: { osce_session_topic_snapshot: { select: { title: true } } },
      orderBy: { id: 'desc' },
    })

    if (!session) return null

    return {
      uniqueId: session.unique_id,
      topicTitle: session.osce_session_topic_snapshot?.title || 'Kasus tanpa judul',
      totalScore: session.total_score,
      maxScore: session.max_score,
      percentage: scorePercentage(session.total_score, session.max_score),
      completedAt: session.updated_at,
    }
  }
}
