import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from "#services/baseService"
import idriveService from "#services/idrive.service"

export class GetFlashcardDeckDetailService extends BaseService {
    static async call(deckId) {
        this.validate(deckId)

        const deck = await prisma.flashcard_decks.findUnique({
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

        if (!deck) {
            throw new ValidationError('Deck not found')
        }

        // Fetch PDF attachment for deck if exists
        const deckAttachment = await prisma.attachments.findFirst({
            where: {
                recordType: 'flashcard_deck',
                recordId: deck.id,
                name: 'pdf'
            },
            include: {
                blob: true
            }
        })

        // Generate presigned URL for deck PDF if blob exists
        let deckPdfUrl = null
        if (deckAttachment?.blob) {
            deckPdfUrl = await idriveService.getSignedUrl(deckAttachment.blob.key, 7 * 24 * 60 * 60)
        }

        // Get attachments for all cards
        const cardIds = deck.flashcard_cards.map(c => c.id)
        const attachments = await prisma.attachments.findMany({
            where: {
                recordType: 'flashcard_card',
                recordId: { in: cardIds },
                name: 'image'
            }
        })

        // Get blobs for all attachments
        const blobIds = attachments.map(a => a.blobId)
        const blobs = await prisma.blobs.findMany({
            where: { id: { in: blobIds } }
        })

        // Create maps for quick lookup
        const attachmentMap = new Map()
        attachments.forEach(att => {
            attachmentMap.set(att.recordId, att)
        })

        const blobMap = new Map()
        blobs.forEach(blob => {
            blobMap.set(blob.id, blob)
        })

        // Get blob keys for presigned URL generation
        const blobKeys = []
        const cardBlobKeyMap = new Map()

        deck.flashcard_cards.forEach(card => {
            const attachment = attachmentMap.get(card.id)
            if (attachment) {
                const blob = blobMap.get(attachment.blobId)
                if (blob) {
                    blobKeys.push(blob.key)
                    cardBlobKeyMap.set(card.id, blob.key)
                }
            }
        })

        // Generate presigned URLs (bulk operation)
        const presignedUrls = blobKeys.length > 0
            ? await idriveService.getBulkSignedUrls(blobKeys, 3600)
            : []

        // Map presigned URLs back to cards
        const urlMap = new Map()
        let urlIndex = 0
        deck.flashcard_cards.forEach(card => {
            if (cardBlobKeyMap.has(card.id)) {
                urlMap.set(card.id, presignedUrls[urlIndex++])
            }
        })

        // Add image data to cards
        deck.flashcard_cards = deck.flashcard_cards.map(card => {
            const attachment = attachmentMap.get(card.id)
            const blob = attachment ? blobMap.get(attachment.blobId) : null

            return {
                ...card,
                image_url: urlMap.get(card.id) || null, // Presigned URL for display
                image_key: blob?.key || null, // Blob key for re-submitting
                image: blob ? {
                    id: blob.id,
                    key: blob.key,
                    filename: blob.filename,
                    contentType: blob.contentType,
                    byteSize: blob.byteSize,
                    checksum: blob.checksum,
                    metadata: blob.metadata ? JSON.parse(blob.metadata) : {},
                    uploadedAt: blob.uploadedAt,
                    attachmentId: attachment.id
                } : null
            }
        })

        // Transform tags to include tag_group info
        const transformedDeck = {
            ...deck,
            blob: deckAttachment ? {
                id: deckAttachment.blobId,
                url: deckPdfUrl,
                key: deckAttachment.blob.key,
                filename: deckAttachment.blob.filename,
                size: deckAttachment.blob.byteSize
            } : null,
            tags: deck.flashcard_deck_tags.map(t => ({
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

    static validate(deckId) {
        if (!deckId) {
            throw new ValidationError('Deck ID is required')
        }

        const id = parseInt(deckId)
        if (isNaN(id) || id <= 0) {
            throw new ValidationError('Invalid deck ID')
        }
    }
}
