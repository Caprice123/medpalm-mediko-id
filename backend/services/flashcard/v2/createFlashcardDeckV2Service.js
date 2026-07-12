import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import attachmentService from '#services/attachment/attachmentService'

export class CreateFlashcardDeckV2Service extends BaseService {
  static async call({ title, description, status, cards = [], created_by }) {
    if (!title || !title.trim()) {
      throw new ValidationError('Judul wajib diisi')
    }
    if (status && !['draft', 'published'].includes(status)) {
      throw new ValidationError('Status tidak valid')
    }

    const deck = await prisma.$transaction(async (tx) => {
      const createdDeck = await tx.flashcard_decks.create({
        data: {
          title: title.trim(),
          description: description || '',
          content_type: 'text',
          content: null,
          flashcard_count: cards.length,
          status: status || 'draft',
          created_by,
          flashcard_cards: {
            create: cards.map((card, i) => ({
              front: card.front,
              back: card.back,
              order: card.order !== undefined ? card.order : i,
            })),
          },
          flashcard_deck_tags: { create: [] },
        },
        include: {
          flashcard_cards: { orderBy: { order: 'asc' } },
          flashcard_deck_tags: { include: { tags: { include: { tag_group: true } } } },
        },
      })

      for (let i = 0; i < cards.length; i++) {
        if (cards[i].blobId && createdDeck.flashcard_cards[i]) {
          await attachmentService.attach({
            name: 'image',
            recordType: 'flashcard_card',
            recordId: createdDeck.flashcard_cards[i].id,
            blobId: cards[i].blobId,
          })
        }
      }

      return createdDeck
    })

    return { ...deck, tags: [] }
  }
}
