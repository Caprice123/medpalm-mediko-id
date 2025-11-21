import prisma from '../../prisma/client.js'
import { BaseService } from '../baseService.js'
import { ValidationError } from '../../errors/validationError.js'
import { GetConstantsService } from '../constant/getConstantsService.js'

export class StartFlashcardWithDeckService extends BaseService {
  static async call({ userLearningSessionId, attemptId, flashcardDeckId, userId }) {
    // Get credit cost from constants BEFORE transaction
    const constants = await GetConstantsService.call(['flashcard_credit_cost'])
    const creditCost = parseInt(constants.flashcard_credit_cost)

    const result = await prisma.$transaction(async (tx) => {
      // Get the attempt directly
      const attempt = await tx.flashcard_session_attempts.findUnique({
        where: { id: parseInt(attemptId) },
        include: {
          flashcard_session: {
            include: {
              user_learning_session: true
            }
          }
        }
      })

      if (!attempt) {
        throw new ValidationError('Attempt not found')
      }

      // Verify user owns this attempt
      if (attempt.flashcard_session.user_learning_session.user_id !== parseInt(userId)) {
        throw new ValidationError('Unauthorized')
      }

      // Verify the attempt belongs to the specified learning session
      if (attempt.flashcard_session.user_learning_session_id !== parseInt(userLearningSessionId)) {
        throw new ValidationError('Attempt does not belong to this session')
      }

      // Check if deck already selected
      if (attempt.flashcard_session.flashcard_deck_id) {
        throw new ValidationError("You have already selected a deck")
      }

      // Get the deck with cards
      const deck = await tx.flashcard_decks.findUnique({
        where: { id: parseInt(flashcardDeckId) },
        include: {
          flashcard_cards: {
            orderBy: { order: 'asc' }
          },
          flashcard_deck_tags: {
            include: { tags: true }
          }
        }
      })

      if (!deck) {
        throw new ValidationError('Deck not found')
      }

      if (!deck.flashcard_cards || deck.flashcard_cards.length === 0) {
        throw new ValidationError('Deck has no cards')
      }

      // Check and deduct credits
      let userCredit = await tx.user_credits.findUnique({
        where: { userId: parseInt(userId) }
      })

      if (!userCredit || userCredit.balance < creditCost) {
        throw new ValidationError('Insufficient credits')
      }

      // Create deck snapshot
      const deckSnapshot = {
        id: deck.id,
        title: deck.title || 'Untitled',
        description: deck.description || '',
        content_type: deck.content_type || 'text',
        tags: (deck.flashcard_deck_tags || []).map(t => ({
          id: t.tags?.id || t.id,
          name: t.tags?.name || t.name || '',
          type: t.tags?.type || t.type || ''
        })),
        cards: deck.flashcard_cards.map((card, index) => ({
          id: card.id,
          front: card.front || '',
          back: card.back || '',
          order: card.order !== undefined ? card.order : index
        }))
      }

      // Create card snapshots for database
      const cardSnapshots = deck.flashcard_cards.map((card, index) => ({
        flashcard_session_id: attempt.flashcard_session.id,
        original_card_id: card.id,
        front_text: card.front || '',
        back_text: card.back || '',
        order: card.order !== undefined ? card.order : index
      }))

      await tx.flashcard_session_cards.createMany({
        data: cardSnapshots
      })

      // Update flashcard session with deck
      await tx.flashcard_sessions.update({
        where: { id: attempt.flashcard_session.id },
        data: {
          flashcard_deck_id: flashcardDeckId,
          total_cards: deck.flashcard_cards.length,
          credits_used: creditCost
        }
      })

      // Update attempt started_at and status
      const updatedAttempt = await tx.flashcard_session_attempts.update({
        where: { id: attempt.id },
        data: {
          started_at: new Date(),
          status: 'active'
        }
      })

      // Deduct credits
      await tx.user_credits.update({
        where: { userId: parseInt(userId) },
        data: {
          balance: { decrement: creditCost }
        }
      })

      // Record credit transaction
      await tx.credit_transactions.create({
        data: {
          userId: parseInt(userId),
          userCreditId: userCredit.id,
          type: 'deduction',
          amount: -creditCost,
          balanceBefore: userCredit.balance,
          balanceAfter: userCredit.balance - creditCost,
          description: `Started flashcard: ${deck.title}`,
          sessionId: attempt.flashcard_session.id
        }
      })

      return {
        attempt: updatedAttempt,
        deckSnapshot
      }
    })

    return result
  }
}
