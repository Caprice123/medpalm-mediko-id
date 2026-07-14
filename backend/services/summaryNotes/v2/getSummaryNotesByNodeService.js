import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class GetSummaryNotesByNodeService extends BaseService {
  static async call({ nodeId, search, page = 1, perPage = 100 } = {}) {
    const currentPage = Math.max(1, parseInt(page) || 1)
    const currentPerPage = Math.min(100, Math.max(1, parseInt(perPage) || 100))
    const skip = (currentPage - 1) * currentPerPage
    const take = currentPerPage + 1

    const where = { is_deleted: false, status: 'published' }

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
      orderBy: { title: 'asc' }
    })

    const sliced = notes.slice(0, currentPerPage)

    // When searching (no nodeId), attach node breadcrumb to each note
    if (search && !nodeId && sliced.length > 0) {
      const noteIds = sliced.map(n => n.id)
      const nodeRecords = await prisma.feature_node_records.findMany({
        where: { record_type: 'summary_note', record_id: { in: noteIds } },
        include: { node: { include: { parent: true } } },
      })
      const nodeMap = new Map()
      nodeRecords.forEach(r => { if (!nodeMap.has(r.record_id)) nodeMap.set(r.record_id, r.node) })
      sliced.forEach(n => { n._node = nodeMap.get(n.id) ?? null })
    }

    const isLastPage = notes.length <= currentPerPage
    return {
      data: sliced,
      pagination: { page: currentPage, perPage: currentPerPage, isLastPage }
    }
  }
}
