import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'

export class DeleteFeatureNodeService extends BaseService {
  static async call({ id }) {
    const node = await prisma.feature_nodes.findUnique({
      where: { id: parseInt(id) },
      include: { _count: { select: { children: true } } },
    })
    if (!node) throw new ValidationError('Node tidak ditemukan')

    if (node._count.children > 0) {
      throw new ValidationError('Node tidak bisa dihapus karena masih memiliki node turunan')
    }

    const operations = [
      prisma.feature_node_records.deleteMany({ where: { node_id: parseInt(id) } }),
      prisma.feature_nodes.delete({ where: { id: parseInt(id) } }),
    ]

    // Close the gap so sibling order stays a contiguous 0..n-1 sequence
    if (node.order !== null) {
      operations.push(
        prisma.feature_nodes.updateMany({
          where: { parent_id: node.parent_id, order: { gt: node.order } },
          data: { order: { decrement: 1 } },
        })
      )
    }

    await prisma.$transaction(operations)
  }
}
