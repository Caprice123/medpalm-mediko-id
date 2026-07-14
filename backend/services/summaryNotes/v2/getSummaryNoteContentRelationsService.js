import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'

export class GetSummaryNoteContentRelationsService extends BaseService {
  static async call({ uniqueId, targetType, page = 1, perPage = 6 }) {
    if (!['flashcard_deck', 'mcq_topic'].includes(targetType)) {
      throw new ValidationError('targetType tidak valid')
    }

    const note = await prisma.summary_notes.findUnique({
      where: { unique_id: uniqueId },
      select: { id: true, is_deleted: true }
    })
    if (!note || note.is_deleted) throw new ValidationError('Ringkasan tidak ditemukan')

    const relations = await prisma.content_relations.findMany({
      where: { source_type: 'summary_note', source_id: note.id, target_type: targetType },
      orderBy: [{ order: 'asc' }, { id: 'asc' }],
      take: perPage + 1,
      skip: (page - 1) * perPage,
    })

    const isLastPage = relations.length <= perPage
    const pageRelations = relations.slice(0, perPage)

    const targetIds = pageRelations.map(r => r.target_id)

    let data = []
    if (targetType === 'flashcard_deck') {
      data = await prisma.flashcard_decks.findMany({
        where: { id: { in: targetIds }, status: 'published', is_deleted: false },
      })
      data = targetIds
        .map(id => data.find(d => d.id === id))
        .filter(Boolean)
    } else {
      data = await prisma.mcq_topics.findMany({
        where: { id: { in: targetIds }, status: 'published', is_deleted: false },
      })
      data = targetIds
        .map(id => data.find(d => d.id === id))
        .filter(Boolean)
    }

    return { data, pagination: { page, perPage, isLastPage } }
  }
}
