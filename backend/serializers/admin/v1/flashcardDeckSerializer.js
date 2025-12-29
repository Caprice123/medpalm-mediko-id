export class FlashcardDeckSerializer {
    static serialize(deck) {
        // Handle both old and new relation names
        const deckTags = deck.flashcard_deck_tags || deck.tags || [];
        const deckCards = deck.flashcard_cards || deck.cards || [];

        return {
            id: deck.id,
            title: deck.title,
            description: deck.description,
            contentType: deck.content_type,
            content: deck.content,
            status: deck.status,
            blob: deck.blob || null,
            tags: deckTags.map(tag => ({
                id: tag.tags ? tag.tags.id : (tag.tag ? tag.tag.id : tag.id),
                name: tag.tags ? tag.tags.name : (tag.tag ? tag.tag.name : tag.name),
                tagGroup: tag.tags?.tag_group ? {
                    id: tag.tags.tag_group.id,
                    name: tag.tags.tag_group.name
                } : null
            })),
            cards: deckCards.map((card, index) => ({
                id: card.id,
                front: card.front,
                back: card.back,
                order: card.order !== undefined ? card.order : index,
                image: card.image || null
            }))
        }
    }
}
