import { toJakartaISO } from '#utils/dateUtils'

export class FlashcardDeckListV2Serializer {
  static serialize(decks) {
    return decks.map(deck => this.serializeDeck(deck))
  }

  static serializeDeck(deck) {
    const deckCards = deck.flashcard_cards || []

    return {
      id: deck.id,
      uniqueId: deck.unique_id,
      title: deck.title,
      description: deck.description,
      status: deck.status,
      cardCount: deckCards.length,
      reviewCounts: deck.reviewCounts ?? null,
      nodes: (deck.nodeRecords || []).map(r => ({
        id: r.id,
        nodeId: r.node_id,
        nodeName: r.node?.name ?? null,
        nodeSlug: r.node?.slug ?? null,
        nodeType: r.node?.node_type ?? null,
        departmentName: r.node?.parent?.name ?? null,
      })),
      createdAt: toJakartaISO(deck.created_at),
      updatedAt: toJakartaISO(deck.updated_at),
    }
  }
}
