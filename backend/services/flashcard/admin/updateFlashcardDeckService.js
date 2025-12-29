import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from "#services/baseService"
import blobService from "#services/attachment/blobService"

export class UpdateFlashcardDeckService extends BaseService {
    static async call(deckId, { title, description, status, tags, cards, blobId }) {
        this.validate(deckId, { title, cards })

        // Check if deck exists
        const deck = await prisma.flashcard_decks.findUnique({
            where: { id: parseInt(deckId) }
        })

        if (!deck) {
            throw new ValidationError('Deck not found')
        }

        // Update deck with all fields in a transaction
        const updatedDeck = await prisma.$transaction(async (tx) => {
            // Update deck basic info
            await tx.flashcard_decks.update({
                where: { id: parseInt(deckId) },
                data: {
                    title: title || deck.title,
                    description: description !== undefined ? description : deck.description,
                    status: status || deck.status,
                    flashcard_count: cards.length,
                }
            })

            // Update deck PDF attachment if blobId is provided
            if (blobId !== undefined) {
                // Delete existing PDF attachment
                await tx.attachments.deleteMany({
                    where: {
                        record_type: 'flashcard_deck',
                        record_id: parseInt(deckId),
                        name: 'pdf'
                    }
                })

                // Create new PDF attachment if blobId is not null
                if (blobId) {
                    await tx.attachments.create({
                        data: {
                            name: 'pdf',
                            record_type: 'flashcard_deck',
                            record_id: parseInt(deckId),
                            blob_id: blobId
                        }
                    })
                }
            }

            // Update tags if provided
            if (tags && Array.isArray(tags)) {
                // Delete existing tags
                await tx.flashcard_deck_tags.deleteMany({
                    where: { deck_id: parseInt(deckId) }
                })

                // Create new tags
                if (tags.length > 0) {
                    await tx.flashcard_deck_tags.createMany({
                        data: tags.map(tagId => ({
                            deck_id: parseInt(deckId),
                            tag_id: parseInt(tagId)
                        }))
                    })
                }
            }

            // Update cards
            // First, get existing cards to delete their attachments
            const existingCards = await tx.flashcard_cards.findMany({
                where: { deck_id: parseInt(deckId) }
            })

            // Delete attachments for existing cards
            if (existingCards.length > 0) {
                await tx.attachments.deleteMany({
                    where: {
                        record_type: 'flashcard_card',
                        record_id: { in: existingCards.map(c => c.id) }
                    }
                })
            }

            // Delete existing cards
            await tx.flashcard_cards.deleteMany({
                where: { deck_id: parseInt(deckId) }
            })

            // Create new cards
            const createdCards = []
            for (let i = 0; i < cards.length; i++) {
                const card = cards[i]
                const createdCard = await tx.flashcard_cards.create({
                    data: {
                        deck_id: parseInt(deckId),
                        front: card.front,
                        back: card.back,
                        order: card.order !== undefined ? card.order : i
                    }
                })
                createdCards.push(createdCard)

                // Create attachment if card has image
                if (card.image_key) {
                    const blob = await blobService.getBlobByKey(card.image_key)
                    if (blob) {
                        await tx.attachments.create({
                            data: {
                                name: 'image',
                                record_type: 'flashcard_card',
                                record_id: createdCard.id,
                                blob_id: blob.id
                            }
                        })
                    }
                }
            }

            // Fetch and return updated deck
            return await tx.flashcard_decks.findUnique({
                where: { id: parseInt(deckId) },
                include: {
                    flashcard_cards: {
                        orderBy: { order: 'asc' }
                    },
                    flashcard_deck_tags: {
                        include: {
                            tags: {
                                include: {
                                    tag_group: true
                                }
                            }
                        }
                    }
                }
            })
        })

        // Transform tags to match expected format
        const transformedDeck = {
            ...updatedDeck,
            tags: updatedDeck.flashcard_deck_tags.map(t => ({
                id: t.tags.id,
                name: t.tags.name,
                type: t.tags.type,
                tag_group: {
                    id: t.tags.tag_group?.id,
                    name: t.tags.tag_group?.name
                }
            }))
        }

        return transformedDeck
    }

    static validate(deckId, { title, cards }) {
        if (!deckId) {
            throw new ValidationError('Deck ID is required')
        }

        const id = parseInt(deckId)
        if (isNaN(id) || id <= 0) {
            throw new ValidationError('Invalid deck ID')
        }

        if (title !== undefined && (!title || typeof title !== 'string')) {
            throw new ValidationError('Title must be a non-empty string')
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
