import prisma from '../../../prisma/client.js'
import { BaseService } from '../../baseService.js'
import { ValidationError } from '../../../errors/validationError.js'

export class GetFlashcardAttemptDetailService extends BaseService {
  static async call({ attemptId, userId }) {
    // Validate inputs
    if (!attemptId) {
      throw new ValidationError('Attempt ID is required')
    }

    // Get the attempt with all related data
    const attempt = await prisma.flashcard_session_attempts.findUnique({
      where: { id: parseInt(attemptId) },
      include: {
        flashcard_session: {
          include: {
            user_learning_session: true,
            flashcard_deck: {
              select: {
                id: true,
                title: true,
                description: true
              }
            },
            flashcard_session_cards: {
              orderBy: { order: 'asc' },
              select: {
                id: true,
                original_card_id: true,
                front_text: true,
                back_text: true,
                order: true
              }
            }
          }
        },
        flashcard_session_answers: {
          select: {
            id: true,
            flashcard_session_card_id: true,
            user_answer: true,
            is_correct: true,
            similarity_score: true,
            time_taken_seconds: true
          }
        }
      }
    })

    if (!attempt) {
      throw new ValidationError('Attempt not found')
    }

    // Verify user owns this attempt
    if (userId && attempt.flashcard_session.user_learning_session.user_id !== parseInt(userId)) {
      throw new ValidationError('Unauthorized to view this attempt')
    }

    const learningSession = attempt.flashcard_session.user_learning_session
    const flashcardSession = attempt.flashcard_session

    // Get user's progress for difficulty-based sorting
    const originalCardIds = flashcardSession.flashcard_session_cards
      .map(card => card.original_card_id)
      .filter(id => id != null)

    const userProgress = await prisma.user_card_progress.findMany({
      where: {
        user_id: learningSession.user_id,
        card_id: { in: originalCardIds }
      }
    })

    // Create progress map for quick lookup
    const progressMap = {}
    userProgress.forEach(progress => {
      progressMap[progress.card_id] = {
        times_correct: progress.times_correct,
        times_incorrect: progress.times_incorrect
      }
    })

    // Merge progress with cards
    const cardsWithProgress = flashcardSession.flashcard_session_cards.map(card => ({
      ...card,
      times_correct: progressMap[card.original_card_id]?.times_correct || 0,
      times_incorrect: progressMap[card.original_card_id]?.times_incorrect || 0
    }))

    return {
      id: attempt.id,
      attempt_number: attempt.attempt_number,
      flashcard_session_id: attempt.flashcard_session_id,
      user_learning_session_id: learningSession.id,
      session_type: learningSession.type,
      session_title: learningSession.title,
      deck_id: flashcardSession.flashcard_deck_id,
      deck_title: flashcardSession.flashcard_deck?.title,
      deck_description: flashcardSession.flashcard_deck?.description,
      credits_used: flashcardSession.credits_used,
      started_at: attempt.started_at,
      completed_at: attempt.completed_at,
      total_cards: flashcardSession.total_cards,
      answers: attempt.flashcard_session_answers,
      cards: cardsWithProgress
    }
  }
}
