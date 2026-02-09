export class FlashcardDeckSerializer {
  static serialize(deck) {
    return {
      id: deck.id,
      uniqueId: deck.uniqueId || deck.unique_id,
      title: deck.title,
      description: deck.description,
      tags: (deck.tags || []).map(t => ({
        id: t.id,
        name: t.name,
        tagGroupId: t.tagGroupId
      })),
      cards: (deck.cards || []).map((card, index) => ({
        id: card.id,
        front: card.front,
        back: card.back,
        imageUrl: card.image_url || null,
        order: card.order !== undefined ? card.order : index
      }))
    }
  }
}
