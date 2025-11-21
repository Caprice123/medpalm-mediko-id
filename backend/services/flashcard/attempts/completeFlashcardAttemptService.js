import prisma from '../../../prisma/client.js'
import { BaseService } from '../../baseService.js'
import { ValidationError } from '../../../errors/validationError.js'

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

export class CompleteFlashcardAttemptService extends BaseService {
  static async call({ attemptId, userId, answers = [] }) {
    // Validate inputs
    if (!attemptId) {
      throw new ValidationError('Attempt ID is required')
    }

    const result = await prisma.$transaction(async (tx) => {
      // Fetch the attempt with cards
      const attempt = await tx.flashcard_session_attempts.findUnique({
        where: { id: parseInt(attemptId) },
        include: {
          flashcard_session: {
            include: {
              user_learning_session: true,
              flashcard_session_cards: {
                orderBy: { order: 'asc' }
              }
            }
          },
          flashcard_session_answers: true
        }
      })

      if (!attempt) {
        throw new ValidationError('Attempt not found')
      }

      if (userId && attempt.flashcard_session.user_learning_session.user_id !== parseInt(userId)) {
        throw new ValidationError('Unauthorized to complete this attempt')
      }

      let answerResults = []

      // Process answers if provided
      if (answers && answers.length > 0) {
        // Create a map of card id to session card for quick lookup
        const sessionCardsMap = {}
        attempt.flashcard_session.flashcard_session_cards.forEach(card => {
          sessionCardsMap[card.id] = card
        })

        // Process each answer
        for (const answer of answers) {
          const sessionCard = sessionCardsMap[answer.cardId]

          if (!sessionCard) {
            throw new ValidationError(`Card ${answer.cardId} not found in this attempt`)
          }

          // Calculate similarity and correctness
          const similarityScore = calculateSimilarity(answer.userAnswer, sessionCard.back_text)
          const isCorrect = similarityScore >= 0.9

          // Create answer record with evaluation
          const answerRecord = await tx.flashcard_session_answers.create({
            data: {
              flashcard_session_attempt_id: attempt.id,
              flashcard_session_card_id: sessionCard.id,
              user_answer: answer.userAnswer || '',
              is_correct: isCorrect,
              similarity_score: similarityScore,
              time_taken_seconds: answer.timeTakenSeconds || 0
            }
          })

          answerResults.push({
            cardId: answer.cardId,
            userAnswer: answer.userAnswer,
            correctAnswer: sessionCard.back_text,
            isCorrect,
            similarityScore,
            answerId: answerRecord.id,
            originalCardId: sessionCard.original_card_id
          })
        }

        // Update user_card_progress for persistent tracking
        const userIdInt = parseInt(userId || attempt.flashcard_session.user_learning_session.user_id)

        for (const result of answerResults) {
          if (result.originalCardId) {
            await tx.user_card_progress.upsert({
              where: {
                user_id_card_id: {
                  user_id: userIdInt,
                  card_id: result.originalCardId
                }
              },
              create: {
                user_id: userIdInt,
                card_id: result.originalCardId,
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
        }
      }

      // Update attempt with completed time and status
      const updatedAttempt = await tx.flashcard_session_attempts.update({
        where: { id: parseInt(attemptId) },
        data: {
          completed_at: new Date(),
          status: 'completed'
        }
      })

      // Get total cards
      const totalCards = attempt.flashcard_session.flashcard_session_cards.length

      return {
        attempt: updatedAttempt,
        total_cards: totalCards,
        answers: answerResults
      }
    })

    return result
  }
}
