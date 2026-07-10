import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class GetFeatureNodesService extends BaseService {
  static async call({ search, nodeType, parentId } = {}) {
    const where = {}

    if (nodeType) where.node_type = nodeType

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
      },
      orderBy: { name: 'asc' },
    })

    return nodes
  }
}
