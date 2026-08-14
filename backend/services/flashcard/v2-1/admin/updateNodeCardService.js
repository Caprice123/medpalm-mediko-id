import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import attachmentService from '#services/attachment/attachmentService'
import { validateCardTypeFields } from '#utils/flashcardCardTypeValidator'

export class UpdateNodeCardService extends BaseService {
  static async call({ cardId, type, front, back, blobId, references, clozeAnswers, occlusionRegions, explanationShort, explanationLong }) {
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
    if (explanationShort !== undefined) data.explanation_short = explanationShort?.trim() || null
    if (explanationLong !== undefined) data.explanation_long = explanationLong?.trim() || null

    const updated = await prisma.flashcard_cards.update({ where: { id: parseInt(cardId) }, data })

    if (blobId !== undefined) {
      const existingAttachment = await prisma.attachments.findFirst({
        where: { record_type: 'flashcard_card', record_id: updated.id, name: 'image' },
      })
      const currentBlobId = existingAttachment?.blob_id ?? null
      const newBlobId = blobId ? parseInt(blobId) : null

      // Only touch the attachment when the blob actually changed — detachAll deletes the
      // underlying blob/file, so re-running it with the same blobId every save would delete
      // and then recreate an attachment pointing at a blob that no longer exists.
      if (newBlobId !== currentBlobId) {
        await attachmentService.detachAll({ recordType: 'flashcard_card', recordId: updated.id })
        if (newBlobId) {
          await attachmentService.attach({ blobId: newBlobId, recordType: 'flashcard_card', recordId: updated.id, name: 'image' })
        }
      }
    }

    const attachment = await attachmentService.getAttachmentWithUrl('flashcard_card', updated.id, 'image')
    return { ...updated, imageUrl: attachment?.url ?? null, imageBlobId: attachment?.blob_id ?? null }
  }
}
