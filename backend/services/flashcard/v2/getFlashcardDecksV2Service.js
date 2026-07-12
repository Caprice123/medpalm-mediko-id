import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class GetFlashcardDecksV2Service extends BaseService {
  static async call(filters = {}, userId = null) {
    const page = parseInt(filters.page) || 1
    const perPage = parseInt(filters.perPage) || 20
    const skip = (page - 1) * perPage
    const take = perPage + 1

    const where = { is_deleted: false }
    if (filters.userRole === 'user') where.status = 'published'
    const andConditions = []

    if (filters.search) {
      const term = filters.search.trim()
      where.OR = [
        { title: { contains: term, mode: 'insensitive' } },
        { description: { contains: term, mode: 'insensitive' } },
      ]
    }

    // Filter by topic node ID — polymorphic lookup first, then filter by deck IDs
    if (filters.topic) {
      const records = await prisma.feature_node_records.findMany({
        where: { node_id: parseInt(filters.topic), record_type: 'flashcard_deck' },
        select: { record_id: true },
      })
      andConditions.push({ id: { in: records.map(r => r.record_id) } })
    }

    // Filter by department node ID — match decks whose topic node's parent is the department
    if (filters.department) {
      const records = await prisma.feature_node_records.findMany({
        where: {
          record_type: 'flashcard_deck',
          node: { parent_id: parseInt(filters.department) },
        },
        select: { record_id: true },
      })
      andConditions.push({ id: { in: records.map(r => r.record_id) } })
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

    // Per-deck review counts
    let reviewCountsByDeckId = {}
    if (userId) {
      const allCardIds = paginatedDecks.flatMap(d => (d.flashcard_cards || []).map(c => c.id))
      if (allCardIds.length > 0) {
        const states = await prisma.user_review_states.findMany({
          where: { user_id: userId, record_type: 'flashcard_card', record_id: { in: allCardIds } },
          select: { record_id: true, last_rating: true, due_date: true },
        })

        const cardToDeck = {}
        for (const d of paginatedDecks) {
          for (const c of d.flashcard_cards || []) cardToDeck[c.id] = d.id
        }

        const now = new Date()
        for (const s of states) {
          const deckId = cardToDeck[s.record_id]
          if (!deckId) continue
          if (!reviewCountsByDeckId[deckId]) reviewCountsByDeckId[deckId] = { again: 0, hard: 0, good: 0, easy: 0, due: 0 }
          const rk = s.last_rating
          if (rk in reviewCountsByDeckId[deckId]) reviewCountsByDeckId[deckId][rk]++
          if (s.due_date <= now) reviewCountsByDeckId[deckId].due++
        }
      }
    }

    const decksWithNodes = paginatedDecks.map(d => ({
      ...d,
      nodeRecords: nodesByDeckId[d.id] || [],
      reviewCounts: reviewCountsByDeckId[d.id] || null,
    }))

    return {
      decks: decksWithNodes,
      pagination: { page, perPage, isLastPage },
    }
  }
}
