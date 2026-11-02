import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import { topicTagIdsFromSnapshots } from '#services/osce/v2/adjustOsceTagStatisticsService'

// Per-topic performance for one user's OSCE practice sessions, where "topic" is the clinical tag
// (Psikiatri, Kardiologi, …), not a row in osce_topics — that is one case/scenario, and a bar per
// case would mostly be a bar per single session.
//
// Two sources, same shape. Which one answers depends on whether the caller's frontend has the
// counters switched on (shouldCalculateOscePerformanceStats in #utils/oscePerformanceStats):
//
//   counters  — user_osce_tag_statistics, maintained at finalize. One indexed read.
//   derived   — the user's own finalized sessions plus their tag snapshots, summed here. Cannot
//               drift and needs no backfill, which is why it stays the answer for any frontend
//               the rollout has not reached.
//
// Score is stored as raw rubric points (total_score out of max_score), and max_score differs
// per case because it follows the rubric. So the bar has to be a percentage, and it is summed
// before dividing — SUM(total)/SUM(max) — which weights every session by the rubric it was
// actually marked against. Averaging the per-session percentages instead would let a session
// marked out of 20 pull as hard as one marked out of 100. Both paths agree on this, which is
// what makes them interchangeable.
export class GetOscePerformanceV2Service extends BaseService {
  static async call(userId, { useStatistics = false } = {}) {
    if (!userId) {
      throw new ValidationError('ID pengguna wajib diisi')
    }

    const totals = useStatistics
      ? await this._fromStatistics(userId)
      : await this._fromSessions(userId)

    if (totals.length === 0) return { topics: [] }

    // Names come from `tags` rather than from anything stored alongside the totals, so a
    // renamed tag renders its new name and never splits into two bars.
    const tags = await prisma.tags.findMany({
      where: { id: { in: totals.map((row) => row.tagId) } },
      select: { id: true, name: true },
    })
    const nameById = new Map(tags.map((tag) => [tag.id, tag.name]))

    const topics = totals.map((row) => ({
      tagId: row.tagId,
      // A hard-deleted tag leaves its sessions behind; the bar still has to be labelled.
      title: nameById.get(row.tagId) || 'Topik dihapus',
      sessionCount: row.sessionCount,
      averageScore: (row.totalScore / row.maxScore) * 100,
    }))

    // Weakest first: this chart is read to decide what to practise next, not to admire.
    topics.sort((a, b) => a.averageScore - b.averageScore)

    return { topics }
  }

  static async _fromStatistics(userId) {
    const rows = await prisma.user_osce_tag_statistics.findMany({
      where: { user_id: userId, max_score: { gt: 0 } },
      select: {
        tag_id: true,
        session_count: true,
        total_score: true,
        max_score: true,
      },
    })

    return rows.map((row) => ({
      tagId: row.tag_id,
      sessionCount: row.session_count,
      totalScore: row.total_score,
      maxScore: row.max_score,
    }))
  }

  // Summed here rather than by the database: a tag only reaches a session through its snapshot
  // rows, which makes this a per-session fan-out rather than something groupBy can express. The
  // read is one user's finalized sessions — tens of rows — so the loop costs nothing, and it
  // keeps the aggregation in the same place as the counter path's rules instead of in SQL.
  static async _fromSessions(userId) {
    const sessions = await prisma.osce_sessions.findMany({
      where: {
        user_id: userId,
        status: 'completed',
        // An unscored session carries null, and a session whose rubric came out empty would
        // divide by zero. Neither belongs in an average — the counter path skips the same rows.
        total_score: { not: null },
        max_score: { gt: 0 },
      },
      select: {
        total_score: true,
        max_score: true,
        osce_session_tag_snapshots: {
          select: {
            tag_id: true,
            tags: { select: { tag_group: { select: { name: true } } } },
          },
        },
      },
    })

    const byTag = new Map()
    for (const session of sessions) {
      // Same filter as the finalize hook, from the same helper, so neither path can start
      // counting a tag group the other ignores.
      for (const tagId of topicTagIdsFromSnapshots(session.osce_session_tag_snapshots)) {
        const row = byTag.get(tagId) || { tagId, sessionCount: 0, totalScore: 0, maxScore: 0 }
        row.sessionCount += 1
        row.totalScore += session.total_score
        row.maxScore += session.max_score
        byTag.set(tagId, row)
      }
    }

    return [...byTag.values()]
  }
}
