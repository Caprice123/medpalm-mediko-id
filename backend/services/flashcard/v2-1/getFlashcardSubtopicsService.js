import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

const DEFAULT_LIMIT = 50

export class GetFlashcardSubtopicsService extends BaseService {
  // cursor here is an offset (count of items already fetched), not a row id — an id-based
  // cursor would sort by id and silently break the admin-curated order/name sort below.
  static async call({ topicId, cursor = null, limit = DEFAULT_LIMIT }) {
    const skip = cursor ?? 0

    const rows = await prisma.feature_nodes.findMany({
      where: {
        parent_id: parseInt(topicId),
        layer: 2,
        visibility: 'general',
        node_type: 'subtopic',
        node_statistics: { some: { record_type: 'flashcard_card', total_count: { gt: 0 } } },
      },
      orderBy: [{ order: { sort: 'asc', nulls: 'last' } }, { name: 'asc' }],
      skip,
      take: limit + 1,
      include: {
        node_statistics: {
          where: { record_type: 'flashcard_card' },
          select: { total_count: true },
        },
      },
    })

    const isLastPage = rows.length <= limit
    const page = isLastPage ? rows : rows.slice(0, limit)
    const nextCursor = isLastPage ? null : skip + limit

    const subtopics = page.map(s => ({
      ...s,
      cardCount: s.node_statistics[0]?.total_count ?? 0,
    }))

    return { subtopics, nextCursor }
  }
}
