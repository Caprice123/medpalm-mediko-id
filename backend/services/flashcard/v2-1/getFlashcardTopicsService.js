import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class GetFlashcardTopicsService extends BaseService {
  static async call() {
    const topics = await prisma.feature_nodes.findMany({
      where: { layer: 1 },
      orderBy: { name: 'asc' },
    })

    const topicIds = topics.map(t => t.id)
    if (topicIds.length === 0) return []

    const subtopics = await prisma.feature_nodes.findMany({
      where: { parent_id: { in: topicIds }, layer: 2 },
      select: {
        id: true,
        parent_id: true,
        node_statistics: {
          where: { record_type: 'flashcard_card' },
          select: { total_count: true },
        },
      },
    })

    const cardsByTopic = new Map()
    for (const s of subtopics) {
      const count = s.node_statistics[0]?.total_count ?? 0
      cardsByTopic.set(s.parent_id, (cardsByTopic.get(s.parent_id) ?? 0) + count)
    }

    return topics.map(t => ({ ...t, cardCount: cardsByTopic.get(t.id) ?? 0 }))
  }
}
