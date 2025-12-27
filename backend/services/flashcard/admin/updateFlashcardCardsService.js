import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from "#services/baseService"

export class UpdateFlashcardCardsService extends BaseService {
    static async call(deckId, cards) {
        this.validate(deckId, cards)

        // Check if deck exists
        const deck = await prisma.flashcard_decks.findUnique({
            where: { id: parseInt(deckId) }
        })

        if (!deck) {
            throw new ValidationError('Deck not found')
        }

        // Delete existing cards and create new ones in a transaction
        const updatedDeck = await prisma.$transaction(async (tx) => {
            // Delete existing cards
            await tx.flashcard_cards.deleteMany({
                where: { deck_id: parseInt(deckId) }
            })

            // Create new cards
            await tx.flashcard_cards.createMany({
                data: cards.map((card, index) => ({
                    deck_id: parseInt(deckId),
                    front: card.front,
                    back: card.back,
                    image_url: card.image_url || null,
                    order: card.order !== undefined ? card.order : index
                }))
            })

            await tx.flashcard_decks.update({
                where: { id: parseInt(deckId) },
                data: {
                    flashcard_count: cards.length,
                }
            })

            // Fetch and return updated deck
            return await tx.flashcard_decks.findUnique({
                where: { id: parseInt(deckId) },
                include: {
                    flashcard_cards: {
                        orderBy: { order: 'asc' }
                    }
                }
            })
        })

        return updatedDeck
    }

    static validate(deckId, cards) {
        if (!deckId) {
            throw new ValidationError('Deck ID is required')
        }

        const id = parseInt(deckId)
        if (isNaN(id) || id <= 0) {
            throw new ValidationError('Invalid deck ID')
        }

        if (!cards || !Array.isArray(cards)) {
            throw new ValidationError('Cards array is required')
        }

        if (cards.length === 0) {
            throw new ValidationError('At least one card is required')
        }

        // Validate each card
        cards.forEach((card, index) => {
            if (!card.front || typeof card.front !== 'string') {
                throw new ValidationError(`Card ${index + 1}: front text is required`)
            }
            if (!card.back || typeof card.back !== 'string') {
                throw new ValidationError(`Card ${index + 1}: back text is required`)
            }
        })
    }
}
