import prisma from '../../prisma/client.js'
import { BaseService } from '../baseService.js'
import { ValidationError } from '../../errors/validationError.js'
import { HasActiveSubscriptionService } from '../pricing/getUserStatusService.js'

export class StartFlashcardDeckService extends BaseService {
  static async call({ flashcardDeckId, userId }) {
    const result = await prisma.$transaction(async (tx) => {
      // Check if user has active subscription
      const hasSubscription = await HasActiveSubscriptionService.call(parseInt(userId))

      if (!hasSubscription) {
        throw new ValidationError('Active subscription required to access flashcards')
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

      // Calculate weight for each card based on performance
      // Higher weight = more likely to appear earlier
      const cardsWithWeights = deck.flashcard_cards.map(card => {
        const progress = progressMap[card.id] || {
          times_incorrect: 0,
          times_correct: 0,
          last_reviewed: new Date(0)
        }

        // Weight calculation:
        // - Base weight: 1
        // - Add 3 for each incorrect answer (heavily prioritize wrong answers)
        // - Subtract 0.5 for each correct answer (slightly deprioritize mastered cards)
        // - Add bonus for cards not reviewed recently
        const daysSinceReview = (Date.now() - new Date(progress.last_reviewed)) / (1000 * 60 * 60 * 24)
        const recencyBonus = Math.min(daysSinceReview / 7, 2) // Max 2 bonus for cards >2 weeks old

        const weight = Math.max(
          1, // Minimum weight of 1
          1 +
          (progress.times_incorrect * 3) -
          (progress.times_correct * 0.5) +
          recencyBonus
        )

        return { card, weight, progress }
      })

      // Weighted random shuffle using cumulative weights
      const sortedCards = []
      const remainingCards = [...cardsWithWeights]

      while (remainingCards.length > 0) {
        // Calculate total weight of remaining cards
        const totalWeight = remainingCards.reduce((sum, item) => sum + item.weight, 0)

        // Pick a random number between 0 and total weight
        let random = Math.random() * totalWeight

        // Find which card this random number corresponds to
        let selectedIndex = 0
        for (let i = 0; i < remainingCards.length; i++) {
          random -= remainingCards[i].weight
          if (random <= 0) {
            selectedIndex = i
            break
          }
        }

        // Add selected card to result and remove from remaining
        sortedCards.push(remainingCards[selectedIndex].card)
        remainingCards.splice(selectedIndex, 1)
      }

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
        deck: deckSnapshot
      }
    })

    return result
  }
}
