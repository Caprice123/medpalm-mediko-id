import prisma from '../../../prisma/client.js'
import { BaseService } from '../../baseService.js'
import { ValidationError } from '../../../errors/validationError.js'

export class GetListAttemptsService extends BaseService {
  static async call({ userLearningSessionId, userId, limit = 30, offset = 0 }) {
    // Validate inputs
    if (!userLearningSessionId) {
      throw new ValidationError('User learning session ID is required')
    }

    // Get the learning session with exercise session and paginated attempts
    const userLearningSession = await prisma.user_learning_sessions.findUnique({
      where: { id: parseInt(userLearningSessionId), user_id: userId },
      include: {
        exercise_session: {
          include: {
            exercise_topic: {
              select: {
                id: true,
                title: true,
                description: true
              }
            },
            exercise_session_attempts: {
              select: {
                id: true,
                attempt_number: true,
                status: true,
                correct_question: true,
                started_at: true,
                completed_at: true,
                score: true,
              },
              orderBy: {
                id: 'desc'
              },
              take: parseInt(limit) + 1, // Fetch one extra to check if there's more
              skip: parseInt(offset)
            },
          }
        }
      }
    })

    if (!userLearningSession) {
      throw new ValidationError('Learning session not found')
    }

    // Get exercise session
    const exerciseSession = userLearningSession.exercise_session

    if (!exerciseSession) {
      throw new ValidationError('No exercise session found')
    }

    // Check if there are more results
    const allAttempts = exerciseSession.exercise_session_attempts
    const hasMore = allAttempts.length > limit
    const isLastPage = !hasMore

    // Get only the requested number of attempts (exclude the extra one)
    const attemptsToReturn = hasMore ? allAttempts.slice(0, limit) : allAttempts

    // Transform attempts with metadata only (no questions/answers/explanations)
    const attempts = attemptsToReturn.map(attempt => {
      return {
        id: attempt.id,
        attemptNumber: attempt.attempt_number,
        started_at: attempt.started_at,
        completed_at: attempt.completed_at,
        status: attempt.status,
        score: attempt.score, // score is already a percentage (0-100)
        correctQuestion: attempt.correct_question,
        totalQuestion: exerciseSession.total_question,
        credits_used: exerciseSession.credits_used,
        percentage: attempt.score, // score is the percentage
        topic_id: exerciseSession.exercise_topic_id,
        topic_title: exerciseSession.exercise_topic?.title,
        topic_description: exerciseSession.exercise_topic?.description
      }
    })

    return {
      data: attempts,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        isLastPage: isLastPage
      }
    }
  }
}
