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

    // Clean up junction/link rows that reference this deck to avoid orphaned relations
    await prisma.summary_note_flashcard_decks.deleteMany({ where: { flashcard_deck_id: deck.id } })

    // Use raw SQL to bypass Prisma's application-level referential integrity check.
    // No actual FK constraints exist in the DB (relationMode = "prisma"), so this is safe.
    await prisma.$executeRaw`DELETE FROM flashcard_decks WHERE id = ${deck.id}`

    return { uniqueId }
  }
}
