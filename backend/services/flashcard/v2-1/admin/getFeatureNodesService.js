import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class GetFeatureNodesService extends BaseService {
  // page/perPage are opt-in — omitting both preserves the old unbounded-fetch behavior for
  // the many existing callers (dropdowns/pickers) that expect the complete list back.
  static async call({ search, nodeType, parentId, layer, visibility, classification, sortBy, page, perPage } = {}) {
    const where = {}

    if (nodeType) where.node_type = nodeType
    if (layer !== undefined) where.layer = parseInt(layer)
    if (visibility) where.visibility = visibility
    if (classification) where.classification = classification

    if (parentId !== undefined) {
      where.parent_id = parentId === null ? null : parseInt(parentId)
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
      ]
    }

    const paginate = page !== undefined || perPage !== undefined
    const currentPage = Math.max(1, parseInt(page) || 1)
    const currentPerPage = Math.min(100, Math.max(1, parseInt(perPage) || 50))

    const nodes = await prisma.feature_nodes.findMany({
      where,
      include: {
        parent: true,
      },
      orderBy: sortBy === 'order'
        ? [{ order: { sort: 'asc', nulls: 'last' } }, { name: 'asc' }]
        : { name: 'asc' },
      ...(paginate ? { skip: (currentPage - 1) * currentPerPage, take: currentPerPage + 1 } : {}),
    })

    if (!paginate) return { nodes, pagination: null }

    const isLastPage = nodes.length <= currentPerPage
    return {
      nodes: nodes.slice(0, currentPerPage),
      pagination: { page: currentPage, perPage: currentPerPage, isLastPage },
    }
  }
}
