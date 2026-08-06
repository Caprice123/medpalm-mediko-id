import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'

// Plain array-index reorder: order is always a tightly-packed 0..n-1 sequence per parent.
// Moving a node only shifts the rows strictly between its old and new position — not
// every sibling — by incrementing/decrementing their order by exactly 1.
export class MoveNodeOrderService extends BaseService {
  static async call({ nodeId, parentId, targetPosition }) {
    const siblings = await prisma.feature_nodes.findMany({
      where: { parent_id: parentId },
      select: { id: true, order: true },
    })

    const node = siblings.find(s => s.id === nodeId)
    if (!node) throw new ValidationError('Sub-topik tidak ditemukan')
    if (node.order === null) throw new ValidationError('Sub-topik ini belum memiliki urutan')

    const maxPosition = siblings.length - 1
    const oldPosition = node.order
    const newPosition = Math.max(0, Math.min(targetPosition, maxPosition))
    if (newPosition === oldPosition) return

    if (newPosition > oldPosition) {
      await prisma.$transaction([
        prisma.feature_nodes.updateMany({
          where: { parent_id: parentId, order: { gt: oldPosition, lte: newPosition } },
          data: { order: { decrement: 1 } },
        }),
        prisma.feature_nodes.update({ where: { id: nodeId }, data: { order: newPosition } }),
      ])
    } else {
      await prisma.$transaction([
        prisma.feature_nodes.updateMany({
          where: { parent_id: parentId, order: { gte: newPosition, lt: oldPosition } },
          data: { order: { increment: 1 } },
        }),
        prisma.feature_nodes.update({ where: { id: nodeId }, data: { order: newPosition } }),
      ])
    }
  }
}
