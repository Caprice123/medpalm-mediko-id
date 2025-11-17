import prisma from '../../../prisma/client.js'
import { BaseService } from '../../baseService.js'
import { ValidationError } from '../../../errors/validationError.js'

export class GetAttemptDetailService extends BaseService {
  static async call({ attemptId, userId }) {
    // Validate inputs
    if (!attemptId) {
      throw new ValidationError('Attempt ID is required')
    }

    // Get the attempt with all related data
    const attempt = await prisma.exercise_session_attempts.findUnique({
      where: { id: parseInt(attemptId) },
      include: {
        exercise_session: {
          include: {
            user_learning_session: true,
            exercise_topic: {
              select: {
                id: true,
                title: true,
                description: true
              }
            },
            exercise_session_questions: {
              orderBy: { order: 'asc' },
              select: {
                id: true,
                question_text: true,
                answer_text: true,
                explanation: true,
                order: true
              }
            }
          }
        },
        exercise_session_answers: {
          select: {
            id: true,
            exercise_session_question_id: true,
            user_answer: true,
            is_correct: true,
            time_taken_seconds: true
          }
        }
      }
    })

    if (!attempt) {
      throw new ValidationError('Attempt not found')
    }

    // Verify user owns this attempt
    if (userId && attempt.exercise_session.user_learning_session.user_id !== parseInt(userId)) {
      throw new ValidationError('Unauthorized to view this attempt')
    }

    const learningSession = attempt.exercise_session.user_learning_session
    const exerciseSession = attempt.exercise_session

    return {
      id: attempt.id,
      attempt_number: attempt.attempt_number,
      exercise_session_id: attempt.exercise_session_id,
      user_learning_session_id: learningSession.id,
      session_type: learningSession.type,
      session_title: learningSession.title,
      topic_id: exerciseSession.exercise_topic_id,
      topic_title: exerciseSession.exercise_topic?.title,
      topic_description: exerciseSession.exercise_topic?.description,
      credits_used: exerciseSession.credits_used,
      started_at: attempt.started_at,
      completed_at: attempt.completed_at,
      status: attempt.status,
      correctQuestion: attempt.correct_question,
      totalQuestion: exerciseSession.total_question,
      score: attempt.score,
      total_questions: exerciseSession.total_question,
      answers: attempt.exercise_session_answers,
      questions: exerciseSession.exercise_session_questions
    }
  }
}
