import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class GetFlashcardSubtopicsService extends BaseService {
  static async call({ topicId }) {
    const subtopics = await prisma.feature_nodes.findMany({
      where: { parent_id: parseInt(topicId), layer: 2 },
      orderBy: { name: 'asc' },
      include: {
        node_statistics: {
          where: { record_type: 'flashcard_card' },
          select: { total_count: true },
        },
      },
    })

    return subtopics.map(s => ({
      ...s,
      cardCount: s.node_statistics[0]?.total_count ?? 0,
      node_statistics: undefined,
    }))
  }
}
