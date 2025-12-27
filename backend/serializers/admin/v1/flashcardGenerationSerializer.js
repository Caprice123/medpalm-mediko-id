export class FlashcardGenerationSerializer {
    /**
     * Serialize generated flashcards (preview mode)
     * @param {Array} cards - Array of generated flashcard objects
     * @param {number|null} blobId - Optional blob ID if generated from PDF
     * @returns {Object} Serialized response
     */
    static serialize(cards, blobId = null) {
        const serializedCards = cards.map((card, index) => ({
            front: card.front || '',
            back: card.back || '',
            order: card.order !== undefined ? card.order : index,
            image_url: card.image_url || null,
            image_key: card.image_key || null,
            image: card.image || null
        }))

        // If blobId is provided (PDF generation), include it in response
        if (blobId) {
            return {
                cards: serializedCards,
                blobId: parseInt(blobId)
            }
        }

        // Otherwise just return cards array
        return serializedCards
    }
}
