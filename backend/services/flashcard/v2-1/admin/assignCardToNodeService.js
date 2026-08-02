import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import { bumpNodeStat } from '#utils/nodeStatisticsHelper'

export class AssignCardToNodeService extends BaseService {
  static async call({ cardId, nodeId }) {
    const card = await prisma.flashcard_cards.findUnique({ where: { id: parseInt(cardId) } })
    if (!card) throw new ValidationError('Kartu tidak ditemukan')

    const existing = await prisma.feature_node_records.findFirst({
      where: { record_type: 'flashcard_card', record_id: parseInt(cardId) },
    })
    if (existing) throw new ValidationError('Kartu ini sudah terhubung ke sub-topik')

    const node = await prisma.feature_nodes.findUnique({ where: { id: parseInt(nodeId) } })
    if (!node) throw new ValidationError('Sub-topik tidak ditemukan')

    await prisma.feature_node_records.create({
      data: { node_id: parseInt(nodeId), record_type: 'flashcard_card', record_id: parseInt(cardId) },
    })

    await bumpNodeStat(prisma, parseInt(nodeId), 'flashcard_card', 1)
    if (node.parent_id) {
      await bumpNodeStat(prisma, node.parent_id, 'flashcard_card', 1)
    }
  }
}
