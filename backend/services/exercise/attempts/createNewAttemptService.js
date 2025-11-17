import prisma from '../../../prisma/client.js'
import { BaseService } from '../../baseService.js'
import { ValidationError } from '../../../errors/validationError.js'

export class CreateNewAttemptService extends BaseService {
  static async call({ userLearningSessionId, userId }) {
    // Validate inputs
    if (!userLearningSessionId || !userId) {
      throw new ValidationError('User learning session ID and user ID are required')
    }

    const result = await prisma.$transaction(async (tx) => {
      // Verify the user_learning_session exists and belongs to the user
      const userLearningSession = await tx.user_learning_sessions.findUnique({
        where: { id: parseInt(userLearningSessionId), user_id: userId },
        include: {
          exercise_session: true
        }
      })

      if (!userLearningSession) {
        throw new ValidationError('Learning session not found')
      }

      // Get the exercise session for this learning session
      const exerciseSession = userLearningSession.exercise_session

      if (!exerciseSession) {
        throw new ValidationError('No exercise session found')
      }

      // Create new attempt
      const newAttempt = await tx.exercise_session_attempts.create({
        data: {
          exercise_session_id: exerciseSession.id,
          attempt_number: exerciseSession.number_of_attempts + 1,
          status: 'active'
        }
      })

      await tx.exercise_sessions.update({
        where: { id: exerciseSession.id },
        data: {
            number_of_attempts: exerciseSession.number_of_attempts + 1,
        }
      })

      return {
        attempt: newAttempt,
        userLearningSession
      }
    })

    return result
  }
}
