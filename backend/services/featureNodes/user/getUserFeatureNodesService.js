import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class GetUserFeatureNodesService extends BaseService {
  static async call({ nodeType, parentId, page = 1, perPage = 30 } = {}) {
    const currentPage = Math.max(1, parseInt(page) || 1)
    const currentPerPage = Math.min(100, Math.max(1, parseInt(perPage) || 30))
    const skip = (currentPage - 1) * currentPerPage
    const take = currentPerPage + 1

    const where = {}
    if (nodeType) where.node_type = nodeType
    if (parentId !== undefined) {
      where.parent_id = parentId === null ? null : parseInt(parentId)
    }

    const nodes = await prisma.feature_nodes.findMany({
      where,
      include: { parent: true },
      orderBy: { name: 'asc' },
      skip,
      take,
    })

    const isLastPage = nodes.length <= currentPerPage
    return {
      data: nodes.slice(0, currentPerPage),
      pagination: { page: currentPage, perPage: currentPerPage, isLastPage },
    }
  }
}
