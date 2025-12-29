export class FlashcardDeckListSerializer {
  static serialize(decks) {
    return decks.map(deck => ({
      id: deck.id,
      title: deck.title,
      description: deck.description,
      tags: (deck.flashcard_deck_tags || []).map(t => ({
        id: t.tags.id,
        name: t.tags.name,
        tagGroup: t.tags.tag_group ? {
          id: t.tags.tag_group.id,
          name: t.tags.tag_group.name
        } : null
      })),
      cardCount: deck.flashcard_cards?.length || deck._count?.flashcard_cards || 0,
      updatedAt: deck.updated_at
    }))
  }
}
