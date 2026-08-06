import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class GetFeatureNodesWithStatsService extends BaseService {
  static async call({ search, nodeType, parentId, layer, visibility, classification, sortBy } = {}) {
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

    const nodes = await prisma.feature_nodes.findMany({
      where,
      include: {
        parent: true,
        node_statistics: true,
      },
      orderBy: sortBy === 'order'
        ? [{ order: { sort: 'asc', nulls: 'last' } }, { name: 'asc' }]
        : { name: 'asc' },
    })

    return nodes
  }
}
