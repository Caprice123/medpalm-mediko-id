import prisma from '../../prisma/client.js'
import { BaseService } from '../baseService.js'
import { ValidationError } from '../../errors/validationError.js'

export class CreateSessionService extends BaseService {
  static async call({ userId, sessionType = 'exercise' }) {
    // Validate inputs
    if (!userId || !sessionType) {
      throw new ValidationError('User ID and Session Type are required')
    }

    const supportedSessionTypes = ["exercise"]
    if (!supportedSessionTypes.includes(sessionType)) {
      throw new ValidationError("Tipe sesi tidak didukung")
    }

    // Create session in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create parent learning session
      const title = sessionType === 'exercise' ? 'Latihan Soal' : 'Learning Session'
      const userLearningSession = await tx.user_learning_sessions.create({
        data: {
          user_id: parseInt(userId),
          title: title,
          type: sessionType
        }
      })

      // Create exercise session (container)
      let exerciseSession = null
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
      }

      return {
        userLearningSession,
        exerciseSession,
        firstAttempt
      }
    })

    return result
  }
}
