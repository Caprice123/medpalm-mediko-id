import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import attachmentService from '#services/attachment/attachmentService'

export class UpdateFlashcardDeckV2Service extends BaseService {
  static async call(uniqueId, { title, description, status, cards }) {
    if (!uniqueId) throw new ValidationError('ID deck wajib diisi')

    const deck = await prisma.flashcard_decks.findUnique({
      where: { unique_id: uniqueId },
    })

    if (!deck) throw new ValidationError('Deck tidak ditemukan')

    const updatedDeck = await prisma.$transaction(async (tx) => {
      const metaUpdate = {}
      if (title !== undefined) metaUpdate.title = title.trim()
      if (description !== undefined) metaUpdate.description = description
      if (status !== undefined) metaUpdate.status = status
      metaUpdate.updated_at = new Date()

      await tx.flashcard_decks.update({ where: { unique_id: uniqueId }, data: metaUpdate })

      if (cards !== undefined && Array.isArray(cards)) {
        const existingCards = await tx.flashcard_cards.findMany({ where: { deck_id: deck.id } })

        if (existingCards.length > 0) {
          await tx.attachments.deleteMany({
            where: { record_type: 'flashcard_card', record_id: { in: existingCards.map(c => c.id) } },
          })
        }

        await tx.flashcard_cards.deleteMany({ where: { deck_id: deck.id } })

        const createdCards = []
        for (let i = 0; i < cards.length; i++) {
          const card = cards[i]
          const created = await tx.flashcard_cards.create({
            data: { deck_id: deck.id, front: card.front, back: card.back, order: card.order ?? i },
          })
          createdCards.push(created)

          if (card.blobId) {
            await attachmentService.attach({
              name: 'image',
              recordType: 'flashcard_card',
              recordId: created.id,
              blobId: card.blobId,
            })
          }
        }

        await tx.flashcard_decks.update({
          where: { unique_id: uniqueId },
          data: { flashcard_count: cards.length },
        })
      }

      return await tx.flashcard_decks.findUnique({
        where: { unique_id: uniqueId },
        include: {
          flashcard_cards: { orderBy: { order: 'asc' } },
          flashcard_deck_tags: { include: { tags: { include: { tag_group: true } } } },
        },
      })
    })

    return {
      ...updatedDeck,
      tags: updatedDeck.flashcard_deck_tags.map(t => ({
        id: t.tags.id,
        name: t.tags.name,
        tag_group: { id: t.tags.tag_group?.id, name: t.tags.tag_group?.name },
      })),
    }
  }
}
