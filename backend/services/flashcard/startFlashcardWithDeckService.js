import prisma from '../../prisma/client.js'
import { BaseService } from '../baseService.js'
import { ValidationError } from '../../errors/validationError.js'
import { GetConstantsService } from '../constant/getConstantsService.js'

export class StartFlashcardWithDeckService extends BaseService {
  static async call({ userLearningSessionId, flashcardDeckId, userId }) {
    // Get credit cost from constants BEFORE transaction
    const constants = await GetConstantsService.call(['flashcard_credit_cost'])
    const creditCost = parseInt(constants.flashcard_credit_cost)

    const result = await prisma.$transaction(async (tx) => {
      // Get the flashcard session
      const flashcardSession = await tx.flashcard_sessions.findFirst({
        where: {
          user_learning_session_id: parseInt(userLearningSessionId)
        },
        include: {
          user_learning_session: true
        }
      })

      if (!flashcardSession) {
        throw new ValidationError('Flashcard session not found')
      }

      // Verify user owns this session
      if (flashcardSession.user_learning_session.user_id !== parseInt(userId)) {
        throw new ValidationError('Unauthorized')
      }

      // Check if deck already selected
      if (flashcardSession.flashcard_deck_id) {
        throw new ValidationError("You have already selected a deck for this session")
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

      // Get user's progress for cards in this deck to implement spaced repetition
      const cardIds = deck.flashcard_cards.map(card => card.id)
      const userProgress = await tx.user_card_progress.findMany({
        where: {
          user_id: parseInt(userId),
          card_id: { in: cardIds }
        }
      })

      // Create a map of card_id to progress
      const progressMap = {}
      userProgress.forEach(progress => {
        progressMap[progress.card_id] = progress
      })

      // Sort cards by performance (worst performers first for spaced repetition)
      // Priority: more incorrect answers → less correct answers → last reviewed (oldest first)
      const sortedCards = [...deck.flashcard_cards].sort((a, b) => {
        const aProgress = progressMap[a.id] || { times_incorrect: 0, times_correct: 0, last_reviewed: new Date(0) }
        const bProgress = progressMap[b.id] || { times_incorrect: 0, times_correct: 0, last_reviewed: new Date(0) }

        // First priority: cards with more incorrect answers come first
        if (bProgress.times_incorrect !== aProgress.times_incorrect) {
          return bProgress.times_incorrect - aProgress.times_incorrect
        }

        // Second priority: cards with fewer correct answers come first
        if (aProgress.times_correct !== bProgress.times_correct) {
          return aProgress.times_correct - bProgress.times_correct
        }

        // Third priority: older reviewed cards come first (for cards never reviewed, use oldest date)
        return new Date(aProgress.last_reviewed) - new Date(bProgress.last_reviewed)
      })

      // Create card snapshots for database with new spaced-repetition order
      const cardSnapshots = sortedCards.map((card, index) => ({
        flashcard_session_id: flashcardSession.id,
        original_card_id: card.id,
        front_text: card.front || '',
        back_text: card.back || '',
        order: index  // New order based on spaced repetition
      }))

      await tx.flashcard_session_cards.createMany({
        data: cardSnapshots
      })

      // Update flashcard session with deck
      await tx.flashcard_sessions.update({
        where: { id: flashcardSession.id },
        data: {
          flashcard_deck_id: flashcardDeckId,
          total_cards: sortedCards.length,
          credits_used: creditCost
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
          sessionId: flashcardSession.id
        }
      })

      // Create deck snapshot with sorted cards
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
        cards: sortedCards.map((card, index) => ({
          id: card.id,
          front: card.front || '',
          back: card.back || '',
          order: index  // Spaced repetition order
        }))
      }

      return {
        session: flashcardSession,
        deckSnapshot
      }
    })

    return result
  }
}
