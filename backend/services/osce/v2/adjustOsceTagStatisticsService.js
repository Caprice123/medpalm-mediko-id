import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

// The tag group that holds the clinical topic (Psikiatri, Kardiologi, …). A session carries tags
// from more than one group — 'batch' is the other one — and only this group belongs on the
// performance chart. Compared lowercased, the way endOsceSessionService already reads it.
const TOPIC_TAG_GROUP = 'topic'

// Pulls the topic tag ids out of a session's tag snapshots.
//
// Snapshots, not the case's current tags: the snapshot is what the session was actually
// practised under, so an increment and any later rebuild agree on the same key. The tradeoff is
// that re-tagging a case does not move the contributions its existing sessions already made —
// run backfillOsceTagStatistics.js to reconcile after a re-tag.
//
// Only tag_id is snapshotted, so names are always read live from `tags` and a renamed tag
// renders its new name without touching a stored row.
export const topicTagIdsFromSnapshots = (tagSnapshots = []) => {
  const ids = tagSnapshots
    .filter((snapshot) => snapshot?.tags?.tag_group?.name?.toLowerCase() === TOPIC_TAG_GROUP)
    .map((snapshot) => snapshot.tag_id)

  // A case tagged twice with the same tag would otherwise count the session twice.
  return [...new Set(ids)]
}

// Folds one finalized session into the user's running totals, one row per topic tag the session
// carried. A session tagged with two topics feeds both — deliberately: each bar answers "how do
// I do on this topic", and a case belonging to two topics is evidence for both.
//
// Called once per session because EndOsceSessionService returns early for a session already
// marked completed — a second finalize never reaches the update, so it cannot double count.
//
// Whether it is called at all is the caller's decision: the finalize path only reaches here for
// frontends the rollout covers, see shouldCalculateOscePerformanceStats in
// #utils/oscePerformanceStats. The table's unique index on (user_id, tag_id) must exist before
// that is switched on for a host, or the upsert below throws.
export class AdjustOsceTagStatisticsService extends BaseService {
  static async call({ userId, tagSnapshots, totalScore, maxScore }) {
    // A session that came back unscored, or whose rubric had no points at all, would only
    // distort the average. Skipped rather than rejected: this runs inside finalize, and the
    // session itself is perfectly valid.
    if (!userId) return { skipped: true }
    if (!Number.isFinite(totalScore) || !Number.isFinite(maxScore) || maxScore <= 0) {
      return { skipped: true }
    }

    const tagIds = topicTagIdsFromSnapshots(tagSnapshots)
    if (tagIds.length === 0) return { skipped: true }

    for (const tagId of tagIds) {
      await prisma.user_osce_tag_statistics.upsert({
        where: { user_id_tag_id: { user_id: userId, tag_id: tagId } },
        create: {
          user_id: userId,
          tag_id: tagId,
          session_count: 1,
          total_score: totalScore,
          max_score: maxScore,
        },
        update: {
          session_count: { increment: 1 },
          total_score: { increment: totalScore },
          max_score: { increment: maxScore },
          updated_at: new Date(),
        },
      })
    }

    return { skipped: false, tagCount: tagIds.length }
  }
}
