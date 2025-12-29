import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import { HasActiveSubscriptionService } from '#services/pricing/getUserStatusService'
import idriveService from '#services/idrive.service'

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

      // Get attachments for all cards
      const attachments = await tx.attachments.findMany({
        where: {
          record_type: 'flashcard_card',
          record_id: { in: cardIds },
          name: 'image'
        }
      })

      // Get blobs for all attachments
      const blobIds = attachments.map(a => a.blob_id)
      const blobs = await tx.blobs.findMany({
        where: { id: { in: blobIds } }
      })

      // Create maps for quick lookup
      const attachmentMap = new Map()
      attachments.forEach(att => {
        attachmentMap.set(att.record_id, att)
      })

      const blobMap = new Map()
      blobs.forEach(blob => {
        blobMap.set(blob.id, blob)
      })

      // Get blob keys for presigned URL generation
      const blobKeys = []
      const cardBlobKeyMap = new Map()

      sortedCards.forEach(card => {
        const attachment = attachmentMap.get(card.id)
        if (attachment) {
          const blob = blobMap.get(attachment.blob_id)
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
      sortedCards.forEach(card => {
        if (cardBlobKeyMap.has(card.id)) {
          urlMap.set(card.id, presignedUrls[urlIndex++])
        }
      })

      // Create deck snapshot with sorted cards
      // NOTE: Flashcard needs 'back' (answer) for client-side similarity calculation
      const deckSnapshot = {
        id: deck.id,
        title: deck.title || 'Untitled',
        description: deck.description || '',
        cards: sortedCards.map((card, index) => ({
          id: card.id,
          front: card.front || '',
          back: card.back || '',
          image_url: urlMap.get(card.id) || null,
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
