import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'

export class MoveNodeCardService extends BaseService {
  static async call({ cardId, targetNodeId }) {
    const card = await prisma.flashcard_cards.findUnique({ where: { id: parseInt(cardId) } })
    if (!card) throw new ValidationError('Kartu tidak ditemukan')

    const targetNode = await prisma.feature_nodes.findUnique({ where: { id: parseInt(targetNodeId) } })
    if (!targetNode) throw new ValidationError('Sub-topik tujuan tidak ditemukan')

    await prisma.flashcard_cards.update({
      where: { id: parseInt(cardId) },
      data: { node_id: parseInt(targetNodeId) },
    })

    await prisma.$transaction([
      prisma.node_statistics.update({
        where: { node_id_record_type: { node_id: card.node_id, record_type: 'flashcard_card' } },
        data: { total_count: { decrement: 1 } },
      }),
      prisma.node_statistics.upsert({
        where: { node_id_record_type: { node_id: parseInt(targetNodeId), record_type: 'flashcard_card' } },
        create: { node_id: parseInt(targetNodeId), record_type: 'flashcard_card', total_count: 1 },
        update: { total_count: { increment: 1 } },
      }),
    ])
  }
}
