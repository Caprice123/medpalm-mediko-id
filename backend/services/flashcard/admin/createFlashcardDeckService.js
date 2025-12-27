import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from "../../baseService.js"
import blobService from "../../attachment/blobService.js"
import attachmentService from '#services/attachment/attachmentService'

export class CreateFlashcardDeckService extends BaseService {
    static async call({ title, description, content_type, content, blobId, tags, cards, created_by }) {
        // Validate inputs
        await this.validate({ title, description, content_type, content, blobId, tags, cards })

        // Create deck with cards and tags in a transaction
        const deck = await prisma.$transaction(async (tx) => {
            // Create deck with cards
            const createdDeck = await tx.flashcard_decks.create({
                data: {
                    title,
                    description: description || '',
                    content_type,
                    content: content_type === 'text' ? content : null,
                    flashcard_count: cards.length,
                    status: 'ready',
                    created_by: created_by,
                    flashcard_cards: {
                        create: cards.map((card, index) => ({
                            front: card.front,
                            back: card.back,
                            order: card.order !== undefined ? card.order : index
                        }))
                    },
                    flashcard_deck_tags: {
                        create: tags.map(tag => ({
                            tag_id: typeof tag === 'object' ? tag.id : tag
                        }))
                    }
                },
                include: {
                    flashcard_cards: {
                        orderBy: { order: 'asc' }
                    },
                    flashcard_deck_tags: {
                        include: {
                            tags: true
                        }
                    }
                }
            })

            // Create attachment for deck PDF if blobId provided
            if (blobId && content_type === 'pdf') {
                await tx.attachments.create({
                    data: {
                        name: 'pdf',
                        recordType: 'flashcard_deck',
                        recordId: createdDeck.id,
                        blobId: blobId
                    }
                })
            }

            // Create attachments for cards with images
            for (let i = 0; i < cards.length; i++) {
                const card = cards[i]
                if (card.image_key) {
                    // Find blob by key
                    const blob = await blobService.getBlobByKey(card.image_key)
                    if (blob) {
                        // Create attachment linking card to blob
                        const attachment = await tx.attachments.create({
                            data: {
                                name: 'image',
                                recordType: 'flashcard_card',
                                recordId: createdDeck.flashcard_cards[i].id,
                                blobId: blob.id
                            }
                        })
                    }
                }
            }

            return createdDeck
        })

        return deck
    }

    static async validate({ title, content_type, content, blobId, tags, cards }) {
        // Validate required fields
        if (!title) {
            throw new ValidationError('Title is required')
        }

        if (!content_type || !['text', 'pdf'].includes(content_type)) {
            throw new ValidationError('Content type must be either "text" or "pdf"')
        }

        // Content validation is optional for flashcards since they use individual cards
        // if (content_type === 'text' && !content) {
        //     throw new ValidationError('Content is required for text type')
        // }

        if (content_type === 'pdf' && !blobId) {
            throw new ValidationError('Blob ID is required for PDF type')
        }

        if (!tags || tags.length === 0) {
            throw new ValidationError('At least one tag is required')
        }

        if (!cards || cards.length === 0) {
            throw new ValidationError('At least one card is required')
        }

        // Validate tags exist
        const tagIds = tags.map(t => typeof t === 'object' ? t.id : t)
        const existingTags = await prisma.tags.findMany({
            where: {
                id: { in: tagIds },
                is_active: true
            }
        })

        if (existingTags.length !== tagIds.length) {
            throw new ValidationError('Some tags are invalid or inactive')
        }

        // Validate blob exists if provided
        if (blobId) {
            const blob = await prisma.blobs.findUnique({
                where: { id: blobId }
            })
            if (!blob) {
                throw new ValidationError('Invalid blob ID')
            }
        }
    }
}
