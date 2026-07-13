import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import attachmentService from '#services/attachment/attachmentService'

export class AttachSourcePdfService extends BaseService {
  static async call(uniqueId, blobId) {
    if (!uniqueId) throw new ValidationError('ID deck wajib diisi')
    if (!blobId) throw new ValidationError('Blob ID wajib diisi')

    const deck = await prisma.flashcard_decks.findUnique({ where: { unique_id: uniqueId } })
    if (!deck || deck.is_deleted) throw new ValidationError('Deck tidak ditemukan')

    const blob = await prisma.blobs.findUnique({ where: { id: blobId } })
    if (!blob) throw new ValidationError('File tidak ditemukan')

    await prisma.attachments.deleteMany({
      where: { record_type: 'flashcard_deck', record_id: deck.id, name: 'source_pdf' },
    })

    await attachmentService.attach({
      name: 'source_pdf',
      recordType: 'flashcard_deck',
      recordId: deck.id,
      blobId,
    })
  }
}
