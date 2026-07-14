import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'

export class GetFlashcardDeckContentRelationsService extends BaseService {
  static async call({ uniqueId, targetType, page = 1, perPage = 6 }) {
    if (!['mcq_topic', 'summary_note'].includes(targetType)) {
      throw new ValidationError('targetType tidak valid')
    }

    const deck = await prisma.flashcard_decks.findUnique({
      where: { unique_id: uniqueId },
      select: { id: true, is_deleted: true }
    })
    if (!deck || deck.is_deleted) throw new ValidationError('Deck tidak ditemukan')

    const relations = await prisma.content_relations.findMany({
      where: { source_type: 'flashcard_deck', source_id: deck.id, target_type: targetType },
      orderBy: [{ order: 'asc' }, { id: 'asc' }],
      take: perPage + 1,
      skip: (page - 1) * perPage,
    })

    const isLastPage = relations.length <= perPage
    const pageRelations = relations.slice(0, perPage)
    const targetIds = pageRelations.map(r => r.target_id)

    let data = []
    if (targetType === 'mcq_topic') {
      const rows = await prisma.mcq_topics.findMany({
        where: { id: { in: targetIds }, status: 'published', is_deleted: false },
        select: { id: true, unique_id: true, title: true },
      })
      data = targetIds.map(id => rows.find(r => r.id === id)).filter(Boolean)
    } else {
      const rows = await prisma.summary_notes.findMany({
        where: { id: { in: targetIds }, status: 'published', is_deleted: false },
        select: { id: true, unique_id: true, title: true },
      })
      data = targetIds.map(id => rows.find(r => r.id === id)).filter(Boolean)
    }

    return { data, pagination: { page, perPage, isLastPage } }
  }
}
