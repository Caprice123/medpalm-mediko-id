import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import attachmentService from '#services/attachment/attachmentService'

export class GetNodeCardDetailService extends BaseService {
  static async call({ cardId }) {
    const card = await prisma.flashcard_cards.findUnique({ where: { id: parseInt(cardId) } })
    if (!card) throw new ValidationError('Kartu tidak ditemukan')

    const attachment = await attachmentService.getAttachmentWithUrl('flashcard_card', card.id, 'image')

    const noteRelations = await prisma.content_relations.findMany({
      where: { source_type: 'flashcard_card', source_id: card.id, target_type: 'summary_note' },
    })
    const noteIds = noteRelations.map(r => r.target_id)
    const notes = noteIds.length > 0
      ? await prisma.summary_notes.findMany({ where: { id: { in: noteIds } }, select: { id: true, unique_id: true, title: true } })
      : []
    const noteMap = new Map(notes.map(n => [n.id, n]))
    const linkedSummaryNotes = noteRelations
      .map(r => {
        const note = noteMap.get(r.target_id)
        if (!note) return null
        return { uniqueId: note.unique_id, title: r.label || note.title }
      })
      .filter(Boolean)

    return {
      ...card,
      imageUrl: attachment?.url ?? null,
      imageBlobId: attachment?.blob_id ?? null,
      linkedSummaryNotes,
    }
  }
}
