export class FlashcardDeckSerializer {
    static serialize(deck) {
        // Handle both old and new relation names
        const deckTags = deck.flashcard_deck_tags || deck.tags || [];
        const deckCards = deck.flashcard_cards || deck.cards || [];

        return {
            id: deck.id,
            title: deck.title,
            description: deck.description,
            content_type: deck.content_type,
            content: deck.content,
            status: deck.status,
            // Support both blob object (new) and pdf_url (legacy)
            blob: deck.blob || null,
            pdf_url: deck.pdf_url || deck.blob?.url || null, // Backward compatibility
            tags: deckTags.map(tag => ({
                id: tag.tags ? tag.tags.id : (tag.tag ? tag.tag.id : tag.id),
                name: tag.tags ? tag.tags.name : (tag.tag ? tag.tag.name : tag.name),
                type: tag.tags ? tag.tags.type : (tag.tag ? tag.tag.type : tag.type),
                tag_group: tag.tags?.tag_group ? {
                    id: tag.tags.tag_group.id,
                    name: tag.tags.tag_group.name
                } : null
            })),
            cards: deckCards.map((card, index) => ({
                id: card.id,
                front: card.front,
                back: card.back,
                order: card.order !== undefined ? card.order : index,
                image_url: card.image_url || null,
                image_key: card.image_key || null,
                image: card.image || null
            })),
            flashcard_count: deck.flashcard_count || deckCards.length,
            createdAt: deck.created_at,
            updatedAt: deck.updated_at
        }
    }
}
