import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class GetSummaryNotesByNodeService extends BaseService {
  static async call({ nodeId, search, page = 1, perPage = 100, userRole = 'user' } = {}) {
    const currentPage = Math.max(1, parseInt(page) || 1)
    const currentPerPage = Math.min(100, Math.max(1, parseInt(perPage) || 100))
    const skip = (currentPage - 1) * currentPerPage
    const take = currentPerPage + 1

    const where = { is_deleted: false }
    if (userRole === 'user') where.status = 'published'

    if (nodeId) {
      const parsedNodeId = parseInt(nodeId)
      if (!isNaN(parsedNodeId)) {
        const nodeRecords = await prisma.feature_node_records.findMany({
          where: { node_id: parsedNodeId, record_type: 'summary_note' },
          select: { record_id: true }
        })
        const noteIds = nodeRecords.map(r => r.record_id)
        where.id = { in: noteIds.length > 0 ? noteIds : [-1] }
      }
    }

    if (search) {
      const term = search.trim()
      where.OR = [
        { title: { contains: term, mode: 'insensitive' } },
        { description: { contains: term, mode: 'insensitive' } }
      ]
    }

    const notes = await prisma.summary_notes.findMany({
      where,
      take,
      skip,
      orderBy: { id: 'asc' }
    })

    const isLastPage = notes.length <= currentPerPage
    return {
      data: notes.slice(0, currentPerPage),
      pagination: { page: currentPage, perPage: currentPerPage, isLastPage }
    }
  }
}
