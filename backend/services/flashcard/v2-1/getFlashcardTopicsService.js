import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class GetFlashcardTopicsService extends BaseService {
  static async call() {
    const topics = await prisma.feature_nodes.findMany({
      where: {
        layer: 1,
        visibility: 'general',
        node_type: 'topic',
        node_statistics: { some: { record_type: 'flashcard_card', total_count: { gt: 0 } } },
      },
      orderBy: { name: 'asc' },
      include: {
        node_statistics: {
          where: { record_type: 'flashcard_card' },
          select: { total_count: true },
        },
      },
    })

    return topics.map(t => ({
      ...t,
      cardCount: t.node_statistics[0]?.total_count ?? 0,
    }))
  }
}
