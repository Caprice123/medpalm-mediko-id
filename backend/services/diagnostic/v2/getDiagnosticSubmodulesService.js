import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

const VISIBILITY = 'diagnostic'
const RECORD_TYPE = 'diagnostic_question'

export class GetDiagnosticSubtopicsService extends BaseService {
  static async call({ topicId }) {
    const subtopics = await prisma.feature_nodes.findMany({
      where: {
        parent_id: parseInt(topicId),
        layer: 2,
        visibility: VISIBILITY,
        node_statistics: { some: { record_type: RECORD_TYPE, total_count: { gt: 0 } } },
      },
      include: {
        node_statistics: {
          where: { record_type: RECORD_TYPE },
          select: { total_count: true },
        },
      },
      orderBy: { name: 'asc' },
    })

    return subtopics.map(s => ({
      ...s,
      questionCount: s.node_statistics[0]?.total_count ?? 0,
    }))
  }
}
