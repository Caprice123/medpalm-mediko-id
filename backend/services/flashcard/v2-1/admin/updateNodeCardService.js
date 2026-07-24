import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import attachmentService from '#services/attachment/attachmentService'

export class UpdateNodeCardService extends BaseService {
  static async call({ cardId, front, back, blobId }) {
    if (front !== undefined && !front?.trim()) throw new ValidationError('Front wajib diisi')
    if (back !== undefined && !back?.trim()) throw new ValidationError('Back wajib diisi')

    const card = await prisma.flashcard_cards.findUnique({ where: { id: parseInt(cardId) } })
    if (!card) throw new ValidationError('Kartu tidak ditemukan')

    const updated = await prisma.flashcard_cards.update({
      where: { id: parseInt(cardId) },
      data: {
        ...(front !== undefined && { front: front.trim() }),
        ...(back !== undefined && { back: back.trim() }),
        updated_at: new Date(),
      },
    })

    if (blobId !== undefined) {
      await attachmentService.detachAll({ recordType: 'flashcard_card', recordId: updated.id })
      if (blobId) {
        await attachmentService.attach({ blobId, recordType: 'flashcard_card', recordId: updated.id, name: 'image' })
      }
    }

    return updated
  }
}
