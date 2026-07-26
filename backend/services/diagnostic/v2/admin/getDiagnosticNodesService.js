import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

const VISIBILITY = 'diagnostic'

export class GetDiagnosticNodesService extends BaseService {
  static async call({ search, parentId, layer } = {}) {
    const where = { visibility: VISIBILITY }

    if (layer !== undefined) where.layer = parseInt(layer)

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
        parent: { select: { id: true, name: true } },
        node_statistics: {
          where: { record_type: 'diagnostic_question' },
          select: { total_count: true },
        },
        _count: { select: { children: true } },
      },
      orderBy: { name: 'asc' },
    })

    return nodes.map(n => ({
      id: n.id,
      name: n.name,
      slug: n.slug,
      layer: n.layer,
      visibility: n.visibility,
      classification: n.classification ?? null,
      parent: n.parent,
      childCount: n._count.children,
      questionCount: n.node_statistics[0]?.total_count ?? 0,
    }))
  }
}
