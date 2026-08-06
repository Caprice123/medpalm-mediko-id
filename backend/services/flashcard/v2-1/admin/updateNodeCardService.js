import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import attachmentService from '#services/attachment/attachmentService'
import { validateCardTypeFields } from '#utils/flashcardCardTypeValidator'

export class UpdateNodeCardService extends BaseService {
  static async call({ cardId, type, front, back, blobId, references, clozeAnswers, occlusionRegions }) {
    const card = await prisma.flashcard_cards.findUnique({ where: { id: parseInt(cardId) } })
    if (!card) throw new ValidationError('Kartu tidak ditemukan')

    let data = { updated_at: new Date() }

    if (type !== undefined) {
      const fields = validateCardTypeFields({ type, front, back, blobId, clozeAnswers, occlusionRegions })
      data = {
        ...data,
        type,
        front: fields.front,
        back: fields.back,
        cloze_answers: fields.clozeAnswers,
        occlusion_regions: fields.occlusionRegions,
      }
    } else {
      if (front !== undefined && !front?.trim()) throw new ValidationError('Front wajib diisi')
      if (back !== undefined && !back?.trim()) throw new ValidationError('Back wajib diisi')
      data = {
        ...data,
        ...(front !== undefined && { front: front.trim() }),
        ...(back !== undefined && { back: back.trim() }),
      }
    }

    if (references !== undefined) data.references = Array.isArray(references) ? references : []

    const updated = await prisma.flashcard_cards.update({ where: { id: parseInt(cardId) }, data })

    if (blobId !== undefined) {
      await attachmentService.detachAll({ recordType: 'flashcard_card', recordId: updated.id })
      if (blobId) {
        await attachmentService.attach({ blobId, recordType: 'flashcard_card', recordId: updated.id, name: 'image' })
      }
    }

    return updated
  }
}
