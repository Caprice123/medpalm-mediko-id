import prisma from '../../prisma/client.js'
import { BaseService } from '../baseService.js'
import { ValidationError } from '../../errors/validationError.js'

export class CreateSessionService extends BaseService {
  static async call({ userId, sessionType = 'exercise' }) {
    // Validate inputs
    if (!userId || !sessionType) {
      throw new ValidationError('User ID and Session Type are required')
    }

    const supportedSessionTypes = ["exercise", "flashcard", "summary_notes"]
    if (!supportedSessionTypes.includes(sessionType)) {
      throw new ValidationError("Tipe sesi tidak didukung")
    }

    // Create session in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create parent learning session
      let title = 'Learning Session'
      if (sessionType === 'exercise') {
        title = 'Latihan Soal'
      } else if (sessionType === 'flashcard') {
        title = 'Flashcard Belajar'
      } else if (sessionType === 'summary_notes') {
        title = 'Ringkasan Materi'
      }

      const userLearningSession = await tx.user_learning_sessions.create({
        data: {
          user_id: parseInt(userId),
          title: title,
          type: sessionType
        }
      })

      // Create session type-specific records
      let exerciseSession = null
      let flashcardSession = null
      let firstAttempt = null

      if (sessionType === 'exercise') {
        exerciseSession = await tx.exercise_sessions.create({
          data: {
            user_learning_session_id: userLearningSession.id,
            number_of_attempts: 1,
            total_question: 0,
          }
        })

        // Create first attempt with not_started status
        firstAttempt = await tx.exercise_session_attempts.create({
          data: {
            exercise_session_id: exerciseSession.id,
            attempt_number: 1,
            status: 'not_started'
          }
        })
      } else if (sessionType === 'flashcard') {
        flashcardSession = await tx.flashcard_sessions.create({
          data: {
            user_learning_session_id: userLearningSession.id,
            number_of_attempts: 1,
            total_cards: 0,
          }
        })

        // Create first attempt with not_started status (user needs to select deck first)
        firstAttempt = await tx.flashcard_session_attempts.create({
          data: {
            flashcard_session_id: flashcardSession.id,
            attempt_number: 1,
            status: 'not_started'
          }
        })
      }

      return {
        userLearningSession,
        exerciseSession,
        flashcardSession,
        firstAttempt
      }
    })

    return result
  }
}
