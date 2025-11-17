import prisma from '../../../prisma/client.js'
import { BaseService } from '../../baseService.js'
import { ValidationError } from '../../../errors/validationError.js'

export class SubmitAnswerService extends BaseService {
  static async call({ exerciseSessionId, questionId, userAnswer, timeTakenSeconds }) {
    // Validate inputs
    if (!exerciseSessionId || !questionId || userAnswer === undefined || userAnswer === null) {
      throw new ValidationError('Exercise session ID, question ID, and user answer are required')
    }

    // Fetch the session
    const session = await prisma.exercise_sessions.findUnique({
      where: { id: parseInt(exerciseSessionId) }
    })

    if (!session) {
      throw new ValidationError('Exercise session not found')
    }

    if (session.status !== 'active') {
      throw new ValidationError('Exercise session is not active')
    }

    // Get the question snapshot from exercise_session_questions table
    const questionSnapshot = await prisma.exercise_session_questions.findFirst({
      where: {
        exercise_session_id: parseInt(exerciseSessionId),
        question_id: parseInt(questionId)
      }
    })

    if (!questionSnapshot) {
      throw new ValidationError('Question not found in session')
    }

    // Check if answer already exists
    const existingAnswer = await prisma.exercise_session_answers.findFirst({
      where: {
        exercise_session_id: parseInt(exerciseSessionId),
        exercise_session_question_id: questionSnapshot.id
      }
    })

    if (existingAnswer) {
      throw new ValidationError('Answer already submitted for this question')
    }

    // Check if answer is correct (case-insensitive comparison)
    const isCorrect = questionSnapshot.answer_text.toLowerCase().trim() === userAnswer.toLowerCase().trim()

    // Save answer
    const answer = await prisma.exercise_session_answers.create({
      data: {
        exercise_session_id: parseInt(exerciseSessionId),
        exercise_session_question_id: questionSnapshot.id,
        user_answer: userAnswer,
        is_correct: isCorrect,
        time_taken_seconds: timeTakenSeconds ? parseInt(timeTakenSeconds) : null
      }
    })

    // Update session score if correct
    if (isCorrect) {
      await prisma.exercise_sessions.update({
        where: { id: parseInt(exerciseSessionId) },
        data: {
          score: { increment: 1 }
        }
      })
    }

    return {
      answer,
      isCorrect,
      correctAnswer: questionSnapshot.answer_text,
      explanation: questionSnapshot.explanation
    }
  }
}
