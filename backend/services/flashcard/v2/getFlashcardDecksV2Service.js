import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class GetFlashcardDecksV2Service extends BaseService {
  static async call(filters = {}) {
    const page = parseInt(filters.page) || 1
    const perPage = parseInt(filters.perPage) || 20
    const skip = (page - 1) * perPage
    const take = perPage + 1

    const where = { is_deleted: false }
    const andConditions = []

    if (filters.search) {
      const term = filters.search.trim()
      where.OR = [
        { title: { contains: term, mode: 'insensitive' } },
        { description: { contains: term, mode: 'insensitive' } },
      ]
    }

    // Filter by topic node ID (direct assignment via feature_node_records)
    if (filters.topic) {
      andConditions.push({
        feature_node_records: {
          some: { node_id: parseInt(filters.topic), record_type: 'flashcard_deck' },
        },
      })
    }

    // Filter by department node ID (via topic node whose parent is the department)
    if (filters.department) {
      andConditions.push({
        feature_node_records: {
          some: {
            record_type: 'flashcard_deck',
            node: { parent_id: parseInt(filters.department) },
          },
        },
      })
    }

    if (andConditions.length > 0) {
      where.AND = andConditions
    }

    const decks = await prisma.flashcard_decks.findMany({
      skip,
      take,
      where,
      include: {
        flashcard_cards: { select: { id: true } },
      },
      orderBy: { id: 'desc' },
    })

    const isLastPage = decks.length <= perPage
    const paginatedDecks = decks.slice(0, perPage)

    const deckIds = paginatedDecks.map(d => d.id)
    const nodeRecords = deckIds.length > 0
      ? await prisma.feature_node_records.findMany({
          where: { record_type: 'flashcard_deck', record_id: { in: deckIds } },
          include: { node: { include: { parent: true } } },
        })
      : []

    const nodesByDeckId = {}
    for (const r of nodeRecords) {
      if (!nodesByDeckId[r.record_id]) nodesByDeckId[r.record_id] = []
      nodesByDeckId[r.record_id].push(r)
    }

    const decksWithNodes = paginatedDecks.map(d => ({
      ...d,
      nodeRecords: nodesByDeckId[d.id] || [],
    }))

    return {
      decks: decksWithNodes,
      pagination: { page, perPage, isLastPage },
    }
  }
}
