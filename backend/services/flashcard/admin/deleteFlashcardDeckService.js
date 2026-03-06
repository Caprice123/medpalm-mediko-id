import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class DeleteFlashcardDeckService extends BaseService {
  static async call(uniqueId) {
    if (!uniqueId) {
      throw new ValidationError('Deck unique ID is required')
    }

    const deck = await prisma.flashcard_decks.findUnique({
      where: { unique_id: uniqueId }
    })

    if (!deck) {
      throw new ValidationError('Deck not found')
    }

    await prisma.flashcard_decks.update({
      where: { id: deck.id },
      data: {
        is_deleted: true,
        deleted_at: new Date()
      }
    })

    return { uniqueId }
  }
}
