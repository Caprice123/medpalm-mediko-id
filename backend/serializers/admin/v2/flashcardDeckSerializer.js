import { toJakartaISO } from '#utils/dateUtils'

export class FlashcardDeckV2Serializer {
  static serialize(deck) {
    const deckCards = deck.flashcard_cards || deck.cards || []

    return {
      id: deck.id,
      uniqueId: deck.unique_id,
      title: deck.title,
      description: deck.description,
      status: deck.status,
      cardCount: deckCards.length,
      nodes: (deck.nodeRecords || []).map(r => ({
        id: r.id,
        nodeId: r.node_id,
        nodeName: r.node?.name ?? null,
        nodeSlug: r.node?.slug ?? null,
        nodeType: r.node?.node_type ?? null,
        departmentName: r.node?.parent?.name ?? null,
      })),
      cards: deckCards.map((card, index) => ({
        id: card.id,
        front: card.front,
        back: card.back,
        order: card.order !== undefined ? card.order : index,
        image: card.image || null,
        imageUrl: card.image_url || null,
      })),
      createdAt: toJakartaISO(deck.created_at),
      updatedAt: toJakartaISO(deck.updated_at),
    }
  }
}
