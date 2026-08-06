import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

const RECORD_TYPE = 'summary_note'
const DEFAULT_LIMIT = 50

export class GetSummaryNoteTopicsService extends BaseService {
  static async call({ classification, page = 1, perPage = DEFAULT_LIMIT } = {}) {
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

    const currentPage = Math.max(1, parseInt(page) || 1)
    const currentPerPage = Math.min(100, Math.max(1, parseInt(perPage) || DEFAULT_LIMIT))
    const skip = (currentPage - 1) * currentPerPage

    const rows = await prisma.feature_nodes.findMany({
      where,
      orderBy: { name: 'asc' },
      skip,
      take: currentPerPage + 1,
    })

    const isLastPage = rows.length <= currentPerPage
    return {
      topics: rows.slice(0, currentPerPage),
      pagination: { page: currentPage, perPage: currentPerPage, isLastPage },
    }
  }
}
