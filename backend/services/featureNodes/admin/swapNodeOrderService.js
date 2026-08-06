import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'

// Directly exchanges two siblings' order values — O(1), 2 rows, regardless of how far
// apart they are. This is the primitive for "switch subtopic 2 and 10" in one action,
// instead of nudging one past every subtopic in between.
export class SwapNodeOrderService extends BaseService {
  static async call({ nodeId, withNodeId }) {
    const [nodeA, nodeB] = await Promise.all([
      prisma.feature_nodes.findUnique({ where: { id: nodeId }, select: { order: true, parent_id: true } }),
      prisma.feature_nodes.findUnique({ where: { id: withNodeId }, select: { order: true, parent_id: true } }),
    ])
    if (!nodeA || !nodeB) throw new ValidationError('Sub-topik tidak ditemukan')
    if (nodeA.order === null || nodeB.order === null) throw new ValidationError('Sub-topik ini belum memiliki urutan')
    if (nodeA.parent_id !== nodeB.parent_id) {
      throw new ValidationError('Sub-topik hanya bisa ditukar dengan sub-topik lain dalam topik yang sama')
    }

    await prisma.$transaction([
      prisma.feature_nodes.update({ where: { id: nodeId }, data: { order: nodeB.order } }),
      prisma.feature_nodes.update({ where: { id: withNodeId }, data: { order: nodeA.order } }),
    ])
  }
}
