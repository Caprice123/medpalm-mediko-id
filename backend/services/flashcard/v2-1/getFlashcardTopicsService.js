import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

const DEFAULT_LIMIT = 50

export class GetFlashcardTopicsService extends BaseService {
  static async call({ cursor = null, limit = DEFAULT_LIMIT } = {}) {
    const rows = await prisma.feature_nodes.findMany({
      where: {
        layer: 1,
        visibility: 'general',
        node_type: 'topic',
        node_statistics: { some: { record_type: 'flashcard_card', total_count: { gt: 0 } } },
        ...(cursor ? { id: { gt: cursor } } : {}),
      },
      orderBy: { id: 'asc' },
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
    const nextCursor = isLastPage ? null : page[page.length - 1].id

    const topics = page.map(t => ({
      ...t,
      cardCount: t.node_statistics[0]?.total_count ?? 0,
    }))

    return { topics, nextCursor }
  }
}
