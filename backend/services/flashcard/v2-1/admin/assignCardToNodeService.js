import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'

export class AssignCardToNodeService extends BaseService {
  static async call({ cardId, nodeId }) {
    const card = await prisma.flashcard_cards.findUnique({ where: { id: parseInt(cardId) } })
    if (!card) throw new ValidationError('Kartu tidak ditemukan')
    if (card.node_id !== null) throw new ValidationError('Kartu ini sudah terhubung ke sub-topik')

    const node = await prisma.feature_nodes.findUnique({ where: { id: parseInt(nodeId) } })
    if (!node) throw new ValidationError('Sub-topik tidak ditemukan')

    await prisma.flashcard_cards.update({
      where: { id: parseInt(cardId) },
      data: { node_id: parseInt(nodeId) },
    })

    await prisma.node_statistics.upsert({
      where: { node_id_record_type: { node_id: parseInt(nodeId), record_type: 'flashcard_card' } },
      create: { node_id: parseInt(nodeId), record_type: 'flashcard_card', total_count: 1 },
      update: { total_count: { increment: 1 } },
    })
  }
}
