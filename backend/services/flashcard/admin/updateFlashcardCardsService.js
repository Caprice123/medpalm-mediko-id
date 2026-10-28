import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from "#services/baseService"
import { bumpContentStat, flashcardStatKey } from '#utils/contentStatsHelper'

export class UpdateFlashcardCardsService extends BaseService {
    static async call(deckId, cards) {
        this.validate(deckId, cards)

        // Check if deck exists
        const deck = await prisma.flashcard_decks.findUnique({
            where: { unique_id: deckId }
        })

        if (!deck) {
            throw new ValidationError('Deck not found')
        }

        // Delete existing cards and create new ones in a transaction
        const updatedDeck = await prisma.$transaction(async (tx) => {
            // Cards are hard-deleted here, so count the outgoing set by type before
            // removing it. Deck cards are always basic, but group anyway so a future
            // typed deck card cannot silently skew the counters.
            const outgoing = await tx.flashcard_cards.groupBy({
              by: ['type'],
              where: { deck_id: deck.id },
              _count: { _all: true },
            })
            for (const group of outgoing) {
              await bumpContentStat(tx, flashcardStatKey(group.type), -group._count._all)
            }

            // Delete existing cards
            await tx.flashcard_cards.deleteMany({
                where: { deck_id: deck.id }
            })
            // The replacement set is created as basic cards.
            await bumpContentStat(tx, flashcardStatKey('basic'), cards.length)


            // Create new cards
            await tx.flashcard_cards.createMany({
                data: cards.map((card, index) => ({
                    deck_id: deck.id,
                    front: card.front,
                    back: card.back,
                    image_url: card.image_url || null,
                    references: Array.isArray(card.references) ? card.references : [],
                    order: card.order !== undefined ? card.order : index
                }))
            })

            await tx.flashcard_decks.update({
                where: { unique_id: deckId },
                data: {
                    flashcard_count: cards.length,
                    updated_at: new Date(),
                }
            })

            // Fetch and return updated deck
            return await tx.flashcard_decks.findUnique({
                where: { unique_id: deckId },
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
            throw new ValidationError('Deck unique ID is required')
        }

        if (typeof deckId !== 'string' || deckId.trim() === '') {
            throw new ValidationError('Invalid deck unique ID')
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
