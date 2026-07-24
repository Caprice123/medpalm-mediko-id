import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import attachmentService from '#services/attachment/attachmentService'

export class DeleteNodeCardService extends BaseService {
  static async call({ cardId }) {
    const card = await prisma.flashcard_cards.findUnique({ where: { id: parseInt(cardId) } })
    if (!card) throw new ValidationError('Kartu tidak ditemukan')

    await attachmentService.detachAll({ recordType: 'flashcard_card', recordId: card.id })
    await prisma.flashcard_cards.delete({ where: { id: parseInt(cardId) } })

    if (card.node_id) {
      await prisma.node_statistics.update({
        where: { node_id_record_type: { node_id: card.node_id, record_type: 'flashcard_card' } },
        data: { total_count: { decrement: 1 } },
      })
    }
  }
}
