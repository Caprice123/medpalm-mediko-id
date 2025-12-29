export class FlashcardDeckListSerializer {
    /**
     * Serialize array of decks for list view (index endpoint)
     * Excludes heavy data like content and full card details
     */
    static serialize(decks) {
        return decks.map(deck => this.serializeDeck(deck))
    }

    /**
     * Serialize single deck
     */
    static serializeDeck(deck) {
        // Handle both old and new relation names
        const deckTags = deck.flashcard_deck_tags || deck.tags || [];
        const deckCards = deck.flashcard_cards || deck.cards || [];

        return {
            id: deck.id,
            title: deck.title,
            description: deck.description,
            status: deck.status,
            tags: deckTags.map(tag => ({
                id: tag.tags ? tag.tags.id : (tag.tag ? tag.tag.id : tag.id),
                name: tag.tags ? tag.tags.name : (tag.tag ? tag.tag.name : tag.name),
                tagGroup: tag.tags?.tag_group ? {
                    id: tag.tags.tag_group.id,
                    name: tag.tags.tag_group.name
                } : null
            })),
            cardCount: deckCards.length,
            createdAt: deck.created_at
        }
    }
}
