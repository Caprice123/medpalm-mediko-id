import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class GetFlashcardProgressSubtopicsService extends BaseService {
  static async call({ userId, topicId }) {
    const subtopics = await prisma.feature_nodes.findMany({
      where: {
        parent_id: topicId,
        layer: 2,
        visibility: 'general',
        node_type: 'subtopic',
        // Match the same criteria as the browsable subtopic list (GetFlashcardSubtopicsService)
        node_statistics: { some: { record_type: 'flashcard_card', total_count: { gt: 0 } } },
      },
      select: {
        id: true,
        name: true,
        node_statistics: { where: { record_type: 'flashcard_card' }, select: { total_count: true } },
      },
      orderBy: { name: 'asc' },
    })

    const subtopicIds = subtopics.map(s => s.id)
    const progressRows = subtopicIds.length
      ? await prisma.user_node_progress.findMany({
          where: { user_id: userId, feature_type: 'flashcard_card', node_id: { in: subtopicIds } },
        })
      : []
    const progressMap = new Map(progressRows.map(r => [r.node_id, r]))

    return subtopics.map(s => {
      const p = progressMap.get(s.id)
      return {
        nodeId: s.id,
        nodeName: s.name,
        totalCards: s.node_statistics[0]?.total_count ?? 0,
        counts: {
          again: p?.again_count ?? 0,
          hard: p?.hard_count ?? 0,
          good: p?.good_count ?? 0,
          easy: p?.easy_count ?? 0,
        },
      }
    })
  }
}
