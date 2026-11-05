import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import { scorePercentage } from '#utils/osceSessionTiming'

// The hub's station panel: one page of published stations, each carrying this student's own
// record on it.
//
// That record is the point of the service. A list of forty clinical cases tells a student
// nothing about which one is worth their next fifteen minutes; "Belum pernah dicoba" against
// "Skor terbaik 82" does, and together with the rail's per-topic bars (which filter this same
// panel) it turns picking a station into reading one row.
//
// Written as its own service rather than extending GetPublishedOsceTopicsService: that one is
// V1 and immutable, and it paginates with `take: perPage` + `length < perPage`, which cannot
// report a last page correctly.
export class GetOsceStationsV2Service extends BaseService {
  static async call(userId, filters = {}) {
    if (!userId) {
      throw new ValidationError('ID pengguna wajib diisi')
    }

    const page = Math.max(1, parseInt(filters.page) || 1)
    const perPage = Math.max(1, parseInt(filters.perPage) || 10)

    const stations = await prisma.osce_topics.findMany({
      skip: (page - 1) * perPage,
      // One extra row decides whether another page exists, so no second count query is needed.
      take: perPage + 1,
      where: this._buildWhere(filters),
      select: {
        id: true,
        unique_id: true,
        title: true,
        description: true,
        scenario: true,
        duration_minutes: true,
        osce_topic_tags: {
          select: {
            tags: {
              select: {
                id: true,
                name: true,
                tag_group: { select: { id: true, name: true } },
              },
            },
          },
        },
      },
      orderBy: { id: 'desc' },
    })

    const isLastPage = stations.length <= perPage
    const pageStations = stations.slice(0, perPage)

    const recordByTopicId = await this._recordsFor(
      userId,
      pageStations.map((station) => station.id),
    )

    return {
      stations: pageStations.map((station) => ({
        ...station,
        myRecord: recordByTopicId.get(station.id) || null,
      })),
      pagination: { page, perPage, isLastPage },
    }
  }

  static _buildWhere(filters) {
    // Only ever published: this endpoint is user-facing, and an unpublished station has no
    // rubric a student can be marked against.
    const where = { status: 'published', AND: [] }

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { scenario: { contains: filters.search, mode: 'insensitive' } },
      ]
    }

    // Tag filters are ANDed: picking Psikiatri and a batch means stations carrying both, not
    // either. The rail's performance rows drive `topicTag`, which is what makes a weak-topic
    // row a filter rather than a statistic.
    for (const key of ['topicTag', 'batchTag']) {
      const tagId = parseInt(filters[key])
      if (tagId) {
        where.AND.push({ osce_topic_tags: { some: { tag_id: tagId } } })
      }
    }

    if (where.AND.length === 0) delete where.AND

    return where
  }

  // One read of this student's marked sessions for the stations on this page, aggregated here.
  // Single table, a page's worth of topic ids, and the best score has to be a percentage of each
  // session's own rubric — which `_max: { total_score }` cannot express, since a 19/20 beats a
  // 40/100 — so the rows are summarised in JS, the same way the performance chart does it.
  static async _recordsFor(userId, topicIds) {
    if (topicIds.length === 0) return new Map()

    const sessions = await prisma.osce_sessions.findMany({
      where: {
        user_id: userId,
        osce_topic_id: { in: topicIds },
        status: 'completed',
        total_score: { not: null },
        max_score: { gt: 0 },
      },
      select: {
        osce_topic_id: true,
        unique_id: true,
        total_score: true,
        max_score: true,
        updated_at: true,
      },
      orderBy: { id: 'desc' },
    })

    const byTopic = new Map()

    for (const session of sessions) {
      const percentage = scorePercentage(session.total_score, session.max_score)
      const record = byTopic.get(session.osce_topic_id) || {
        attemptCount: 0,
        bestPercentage: null,
        bestSessionUniqueId: null,
        // Rows arrive newest first, so the first one seen for a topic is its latest attempt.
        lastAttemptAt: session.updated_at,
      }

      record.attemptCount += 1

      if (record.bestPercentage === null || percentage > record.bestPercentage) {
        record.bestPercentage = percentage
        record.bestSessionUniqueId = session.unique_id
      }

      byTopic.set(session.osce_topic_id, record)
    }

    return byTopic
  }
}
