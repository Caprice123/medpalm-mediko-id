import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

const RECORD_TYPE = 'summary_note'
const DEFAULT_LIMIT = 50

export class GetSummaryNoteSubtopicsService extends BaseService {
  static async call({ topicId, page = 1, perPage = DEFAULT_LIMIT }) {
    const currentPage = Math.max(1, parseInt(page) || 1)
    const currentPerPage = Math.min(100, Math.max(1, parseInt(perPage) || DEFAULT_LIMIT))
    const skip = (currentPage - 1) * currentPerPage

    const rows = await prisma.feature_nodes.findMany({
      where: {
        parent_id: parseInt(topicId),
        layer: 2,
        visibility: 'general',
        node_type: 'subtopic',
        node_statistics: { some: { record_type: RECORD_TYPE, total_count: { gt: 0 } } },
      },
      orderBy: { name: 'asc' },
      skip,
      take: currentPerPage + 1,
    })

    const isLastPage = rows.length <= currentPerPage
    return {
      subtopics: rows.slice(0, currentPerPage),
      pagination: { page: currentPage, perPage: currentPerPage, isLastPage },
    }
  }
}
