import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class GetReviewStatsService extends BaseService {
  static async call({ userId }) {
    // All topic-level node records for flashcard decks
    const nodeRecords = await prisma.feature_node_records.findMany({
      where: { record_type: 'flashcard_deck' },
      include: { node: { include: { parent: true } } },
    })

    const topicNodeRecords = nodeRecords.filter(r => r.node?.node_type === 'topic')
    const deckToTopic = new Map()
    topicNodeRecords.forEach(r => deckToTopic.set(r.record_id, r))

    const deckIds = [...deckToTopic.keys()]
    if (deckIds.length === 0) return { dueCount: 0, topics: [] }

    const cards = await prisma.flashcard_cards.findMany({
      where: {
        deck_id: { in: deckIds },
        flashcard_decks: { status: 'published', is_deleted: false },
      },
      select: { id: true, deck_id: true },
    })

    const cardIds = cards.map(c => c.id)

    const reviewStates = await prisma.user_review_states.findMany({
      where: { user_id: userId, record_type: 'flashcard_card', record_id: { in: cardIds } },
    })
    const stateMap = new Map(reviewStates.map(s => [s.record_id, s]))

    const now = new Date()
    const topicStats = new Map()

    cards.forEach(card => {
      const nr = deckToTopic.get(card.deck_id)
      if (!nr) return

      const nodeId = nr.node_id
      if (!topicStats.has(nodeId)) {
        topicStats.set(nodeId, {
          nodeId,
          nodeName: nr.node?.name ?? null,
          departmentName: nr.node?.parent?.name ?? null,
          counts: { again: 0, hard: 0, good: 0, easy: 0, new: 0 },
          dueCount: 0,
          totalCards: 0,
        })
      }

      const stat = topicStats.get(nodeId)
      const state = stateMap.get(card.id)
      stat.totalCards++

      if (state) {
          const rk = state.last_rating
          if (rk in stat.counts) stat.counts[rk]++
          if (state.due_date <= now) stat.dueCount++
      }
    })

    const topics = [...topicStats.values()].sort((a, b) =>
      (a.nodeName ?? '').localeCompare(b.nodeName ?? '', 'id')
    )

    const dueCount = topics.reduce((sum, t) => sum + t.dueCount, 0)

    return { dueCount, topics }
  }
}
