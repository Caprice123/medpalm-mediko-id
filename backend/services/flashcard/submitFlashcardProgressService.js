import prisma from '../../prisma/client.js'
import { BaseService } from '../baseService.js'
import { ValidationError } from '../../errors/validationError.js'

// Calculate similarity between two strings (case-insensitive)
function calculateSimilarity(str1, str2) {
  // Normalize strings: lowercase, trim, remove extra spaces
  const normalize = (s) => (s || '').toLowerCase().trim().replace(/\s+/g, ' ')

  const a = normalize(str1)
  const b = normalize(str2)

  if (a === b) return 1.0
  if (a.length === 0 || b.length === 0) return 0.0

  // Levenshtein distance
  const matrix = []
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i]
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        )
      }
    }
  }

  const distance = matrix[b.length][a.length]
  const maxLength = Math.max(a.length, b.length)

  return 1 - (distance / maxLength)
}

export class SubmitFlashcardProgressService extends BaseService {
  static async call({ deckId, userId, answers = [] }) {
    // Validate inputs
    if (!deckId) {
      throw new ValidationError('Deck ID is required')
    }

    if (!answers || answers.length === 0) {
      throw new ValidationError('Answers are required')
    }

    const result = await prisma.$transaction(async (tx) => {
      // Get the deck with cards to verify answers
      const deck = await tx.flashcard_decks.findUnique({
        where: { id: parseInt(deckId) },
        include: {
          flashcard_cards: true
        }
      })

      if (!deck) {
        throw new ValidationError('Deck not found')
      }

      // Create a map of card id to card for quick lookup
      const cardsMap = {}
      deck.flashcard_cards.forEach(card => {
        cardsMap[card.id] = card
      })

      let answerResults = []

      // Process each answer
      for (const answer of answers) {
        const card = cardsMap[answer.cardId]

        if (!card) {
          throw new ValidationError(`Card ${answer.cardId} not found in this deck`)
        }

        // Calculate similarity and correctness
        const similarityScore = calculateSimilarity(answer.userAnswer, card.back)
        const isCorrect = similarityScore >= 0.9

        answerResults.push({
          cardId: answer.cardId,
          userAnswer: answer.userAnswer,
          correctAnswer: card.back,
          isCorrect,
          similarityScore
        })
      }

      // Update user_card_progress for persistent tracking (spaced repetition)
      const userIdInt = parseInt(userId)

      for (const result of answerResults) {
        await tx.user_card_progress.upsert({
          where: {
            user_id_card_id: {
              user_id: userIdInt,
              card_id: result.cardId
            }
          },
          create: {
            user_id: userIdInt,
            card_id: result.cardId,
            times_correct: result.isCorrect ? 1 : 0,
            times_incorrect: result.isCorrect ? 0 : 1,
            last_reviewed: new Date()
          },
          update: result.isCorrect
            ? {
                times_correct: { increment: 1 },
                last_reviewed: new Date(),
                updated_at: new Date()
              }
            : {
                times_incorrect: { increment: 1 },
                last_reviewed: new Date(),
                updated_at: new Date()
              }
        })
      }

      return {
        total_cards: answerResults.length,
        answers: answerResults
      }
    })

    return result
  }
}
