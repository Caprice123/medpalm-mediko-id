import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

const RECORD_TYPE = 'summary_note'

export class GetSummaryNoteSubtopicsService extends BaseService {
  static async call({ topicId }) {
    const subtopics = await prisma.feature_nodes.findMany({
      where: {
        parent_id: parseInt(topicId),
        layer: 2,
        visibility: 'general',
        node_type: 'subtopic',
        node_statistics: { some: { record_type: RECORD_TYPE, total_count: { gt: 0 } } },
      },
      orderBy: { name: 'asc' },
    })

    return subtopics
  }
}
