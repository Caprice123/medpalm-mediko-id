import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

const RECORD_TYPE = 'summary_note'

export class GetSummaryNoteTopicsService extends BaseService {
  static async call({ classification } = {}) {
    const where = {
      layer: 1,
      visibility: 'general',
      node_type: 'topic',
      children: {
        some: {
          layer: 2,
          node_type: 'subtopic',
          node_statistics: { some: { record_type: RECORD_TYPE, total_count: { gt: 0 } } },
        },
      },
    }
    if (classification) where.classification = classification

    return prisma.feature_nodes.findMany({
      where,
      orderBy: { name: 'asc' },
    })
  }
}
