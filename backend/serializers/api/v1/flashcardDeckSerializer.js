export class FlashcardDeckSerializer {
  static serialize(deck) {
    return {
      id: deck.id,
      title: deck.title,
      description: deck.description,
      cards: (deck.cards || []).map((card, index) => ({
        id: card.id,
        front: card.front,
        back: card.back,
        image_url: card.image_url || null,
        order: card.order !== undefined ? card.order : index
      }))
    }
  }
}
