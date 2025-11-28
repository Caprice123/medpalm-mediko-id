import prisma from '../../prisma/client.js'
import { BaseService } from '../baseService.js'
import { ValidationError } from '../../errors/validationError.js'

export class GetSessionDetailService extends BaseService {
  static async call({ sessionId, userId }) {
    const userLearningSession = await prisma.user_learning_sessions.findUnique({
      where: { id: parseInt(sessionId) },
      include: {
        exercise_session: true,
        flashcard_session: true
      }
    })

    if (!userLearningSession) {
      throw new ValidationError('Sesi not found')
    }

    // Verify user owns this attempt
    if (userId && userLearningSession.user_id !== parseInt(userId)) {
      throw new ValidationError('Unauthorized to view this attempt')
    }

    return {
      id: userLearningSession.id,
      title: userLearningSession.title,
      type: userLearningSession.type,
      session_type: userLearningSession.type,
      created_at: userLearningSession.created_at,
      exerciseSession: await this.populateExerciseQuestionData({ userLearningSession }),
      flashcardSession: await this.populateFlashcardData({ userLearningSession })
    }
  }

  static async populateExerciseQuestionData({ userLearningSession }) {
    // TODO: change exercise into from constant table
    if (userLearningSession.type != "exercise") {
        return
    }

    return {
        totalQuestion: userLearningSession.exercise_session.total_question,
    }
  }

  static async populateFlashcardData({ userLearningSession }) {
    if (userLearningSession.type != "flashcard") {
        return
    }

    const flashcardSession = userLearningSession.flashcard_session

    // If deck has been selected, fetch the cards
    let cards = []
    let deck = null
    if (flashcardSession.flashcard_deck_id) {
      const sessionCards = await prisma.flashcard_session_cards.findMany({
        where: {
          flashcard_session_id: flashcardSession.id
        },
        orderBy: {
          order: 'asc'
        }
      })

      cards = sessionCards.map(card => ({
        id: card.id,
        front: card.front_text,
        back: card.back_text,
        order: card.order,
        original_card_id: card.original_card_id
      }))

      // Get deck info
      const deckData = await prisma.flashcard_decks.findUnique({
        where: { id: flashcardSession.flashcard_deck_id },
        include: {
          flashcard_deck_tags: {
            include: { tags: true }
          }
        }
      })

      if (deckData) {
        deck = {
          id: deckData.id,
          title: deckData.title,
          description: deckData.description,
          tags: deckData.flashcard_deck_tags.map(dt => ({
            id: dt.tags.id,
            name: dt.tags.name,
            type: dt.tags.type
          }))
        }
      }
    }

    return {
        totalCards: flashcardSession.total_cards,
        deckId: flashcardSession.flashcard_deck_id,
        deck,
        cards,
        creditsUsed: flashcardSession.credits_used
    }
  }
}
