import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import { remainingSecondsFor, isExpired, scorePercentage } from '#utils/osceSessionTiming'

// The hub's history panel: this student's sessions as hairline rows, newest first.
//
// Its own service rather than GetUserOsceSessionsService (V1, immutable) for two reasons: that
// one cannot report a last page correctly (`take: perPage` with `length < perPage` calls a
// full page the last one), and it has no status filter, which the hub's counted chips need.
export class GetOsceSessionHistoryV2Service extends BaseService {
  static async call(userId, filters = {}) {
    if (!userId) {
      throw new ValidationError('ID pengguna wajib diisi')
    }

    const page = Math.max(1, parseInt(filters.page) || 1)
    const perPage = Math.max(1, parseInt(filters.perPage) || 10)

    const where = { user_id: userId }

    // `expired` is not a stored status — it is a started session whose bell has rung — so it is
    // resolved after the read, below.
    if (filters.status && filters.status !== 'expired') {
      where.status = filters.status
    } else if (filters.status === 'expired') {
      where.status = 'started'
    }

    const sessions = await prisma.osce_sessions.findMany({
      skip: (page - 1) * perPage,
      take: perPage + 1,
      where,
      include: {
        osce_session_topic_snapshot: {
          // `scenario` rides along because a session still in `created` can be started from a
          // history row, and the start gate shows the task card before the bell.
          select: { title: true, duration_minutes: true, scenario: true },
        },
        osce_session_tag_snapshots: {
          include: { tags: { include: { tag_group: true } } },
        },
      },
      orderBy: { id: 'desc' },
    })

    const isLastPage = sessions.length <= perPage

    return {
      sessions: sessions.slice(0, perPage).map((session) => this._row(session)),
      pagination: { page, perPage, isLastPage },
    }
  }

  static _row(session) {
    const snapshot = session.osce_session_topic_snapshot
    const durationMinutes = snapshot?.duration_minutes || 0
    const expired = isExpired(session, durationMinutes)

    return {
      uniqueId: session.unique_id,
      // One state the UI can switch on, rather than a status plus a clock the row has to
      // interpret for itself.
      state: expired ? 'expired' : session.status,
      topicTitle: snapshot?.title || 'Stasiun tanpa judul',
      scenario: snapshot?.scenario || null,
      durationMinutes,
      remainingSeconds: expired ? 0 : remainingSecondsFor(session, durationMinutes),
      timeTaken: session.time_taken,
      totalScore: session.total_score,
      maxScore: session.max_score,
      percentage: scorePercentage(session.total_score, session.max_score),
      startedAt: session.started_at,
      createdAt: session.created_at,
      updatedAt: session.updated_at,
      tags: session.osce_session_tag_snapshots.map((tagSnapshot) => ({
        id: tagSnapshot.tag_id,
        name: tagSnapshot.tags.name,
        groupName: tagSnapshot.tags.tag_group?.name || null,
      })),
    }
  }
}
