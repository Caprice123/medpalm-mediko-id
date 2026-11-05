import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import { remainingSecondsFor, isExpired, scorePercentage } from '#utils/osceSessionTiming'

// Everything the OSCE hub's left rail needs in one read: the session the student should resume,
// how many sessions sit in each state, and the last station that was actually marked.
//
// The rail leads with "lanjutkan atau mulai" (the user's call this round), so the shape is built
// around one `resumable` session rather than a list: a student is in at most one station at a
// time in practice, and a rail that stacks three live blocks has no lead.
export class GetOsceHubV2Service extends BaseService {
  static async call(userId) {
    if (!userId) {
      throw new ValidationError('ID pengguna wajib diisi')
    }

    const [unfinished, counts, lastScored, practiceSeconds] = await Promise.all([
      this._unfinishedSessions(userId),
      this._countsByStatus(userId),
      this._lastScoredSession(userId),
      this._totalPracticeSeconds(userId),
    ])

    // A started session outranks a created one even when the created one is newer: the started
    // one has a clock running against it, and losing it costs the student the attempt.
    const live = unfinished.filter((session) => session.status === 'started' && !session.expired)
    const expired = unfinished.filter((session) => session.expired)
    const notStarted = unfinished.filter((session) => session.status === 'created')

    return {
      resumable: live[0] || notStarted[0] || null,
      // Surfaced separately so the rail can say "satu sesi kehabisan waktu dan belum dinilai"
      // instead of showing a Lanjutkan button on a clock that reads 00:00.
      expiredCount: expired.length,
      counts: {
        ...counts,
        // `started` rows whose bell has already rung are not really running; move them across
        // so the chips add up to what the student sees in the list.
        running: Math.max(0, (counts.started || 0) - expired.length),
        expired: expired.length,
      },
      lastResult: lastScored,
      totalPracticeSeconds: practiceSeconds,
    }
  }

  // The rail's second footnote. A plain single-table sum over the student's own finished
  // sessions — `time_taken` is already seconds spent, recorded when the session is finalized.
  static async _totalPracticeSeconds(userId) {
    const result = await prisma.osce_sessions.aggregate({
      where: { user_id: userId, status: 'completed' },
      _sum: { time_taken: true },
    })

    return result._sum.time_taken || 0
  }

  // Unfinished means anything the student can still act on. There are only ever a handful of
  // these per user, so they are read whole and sorted here rather than in two queries.
  static async _unfinishedSessions(userId) {
    const sessions = await prisma.osce_sessions.findMany({
      where: {
        user_id: userId,
        status: { in: ['created', 'started'] },
      },
      include: {
        osce_session_topic_snapshot: true,
        osce_session_tag_snapshots: {
          include: { tags: { include: { tag_group: true } } },
        },
        _count: {
          select: {
            osce_session_messages: true,
            osce_session_diagnoses: true,
            osce_session_therapies: true,
            osce_session_observations: true,
          },
        },
      },
      orderBy: { id: 'desc' },
    })

    return sessions.map((session) => {
      const snapshot = session.osce_session_topic_snapshot
      const durationMinutes = snapshot?.duration_minutes || 0

      return {
        uniqueId: session.unique_id,
        status: session.status,
        topicTitle: snapshot?.title || 'Stasiun tanpa judul',
        scenario: snapshot?.scenario || null,
        durationMinutes,
        remainingSeconds: remainingSecondsFor(session, durationMinutes),
        expired: isExpired(session, durationMinutes),
        startedAt: session.started_at,
        tags: session.osce_session_tag_snapshots.map((tagSnapshot) => ({
          id: tagSnapshot.tag_id,
          name: tagSnapshot.tags.name,
          groupName: tagSnapshot.tags.tag_group?.name || null,
        })),
        // What the student still owes the rubric. The hub shows these as the worksheet's
        // empty-section marks, which is the whole point of leading with the running session:
        // the bell must not be the first time they learn Diagnosa was never filled.
        progress: {
          messageCount: session._count.osce_session_messages,
          hasDiagnosis: session._count.osce_session_diagnoses > 0,
          hasTherapy: session._count.osce_session_therapies > 0,
          observationCount: session._count.osce_session_observations,
        },
      }
    })
  }

  static async _countsByStatus(userId) {
    const rows = await prisma.osce_sessions.groupBy({
      by: ['status'],
      where: { user_id: userId },
      _count: { _all: true },
    })

    return rows.reduce((acc, row) => ({ ...acc, [row.status]: row._count._all }), {})
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
      topicTitle: session.osce_session_topic_snapshot?.title || 'Stasiun tanpa judul',
      totalScore: session.total_score,
      maxScore: session.max_score,
      percentage: scorePercentage(session.total_score, session.max_score),
      completedAt: session.updated_at,
    }
  }
}
