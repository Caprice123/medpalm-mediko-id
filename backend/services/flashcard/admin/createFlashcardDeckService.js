import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from "#services/baseService"
import attachmentService from '#services/attachment/attachmentService'

export class CreateFlashcardDeckService extends BaseService {
    static async call({ title, description, contentType, content, blobId, tags, cards, status, created_by }) {
        // Validate inputs
        await this.validate({ title, description, contentType, content, blobId, tags, cards, status })

        // Create deck with cards and tags in a transaction
        const deck = await prisma.$transaction(async (tx) => {
            // Create deck with cards
            const createdDeck = await tx.flashcard_decks.create({
                data: {
                    title,
                    description: description || '',
                    content_type: contentType,
                    content: contentType === 'text' ? content : null,
                    flashcard_count: cards.length,
                    status: status || 'draft',
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

            // Create attachment for deck PDF if blobId provided using attachmentService
            if (blobId && contentType === 'pdf') {
                await attachmentService.attach({
                    name: 'pdf',
                    recordType: 'flashcard_deck',
                    recordId: createdDeck.id,
                    blobId: blobId
                })
            }

            // Create attachments for cards with images using attachmentService
            for (let i = 0; i < cards.length; i++) {
                const card = cards[i]
                if (card.blobId) {
                    // Create attachment linking card to blob
                    await attachmentService.attach({
                        name: 'image',
                        recordType: 'flashcard_card',
                        recordId: createdDeck.flashcard_cards[i].id,
                        blobId: card.blobId
                    })
                }
            }

            return createdDeck
        })

        return deck
    }

    static async validate({ title, contentType, content, blobId, tags, cards, status }) {
        // Validate required fields
        if (!title) {
            throw new ValidationError('Title is required')
        }

        if (!contentType || !['text', 'pdf'].includes(contentType)) {
            throw new ValidationError('Content type must be either "text" or "pdf"')
        }

        if (status && !['draft', 'published'].includes(status)) {
            throw new ValidationError('Status must be either "draft" or "published"')
        }

        // Content validation is optional for flashcards since they use individual cards
        if (contentType === 'text' && !content) {
            throw new ValidationError('Content is required for text type')
        }

        if (contentType === 'pdf' && !blobId) {
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
