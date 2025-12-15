import prisma from '../../prisma/client.js'
import { BaseService } from '../baseService.js'
import { NotFoundError } from '../../errors/notFoundError.js'
import { ValidationError } from '../../errors/validationError.js'

export class SubmitMcqAnswersService extends BaseService {
  static async call({ topicId, answers, userId }) {
    // Get topic with questions
    const topic = await prisma.mcq_topics.findFirst({
      where: {
        id: topicId,
        is_active: true,
        status: 'published'
      },
      include: {
        mcq_questions: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    })

    if (!topic) {
      throw new NotFoundError('MCQ topic not found or not published')
    }

    // Validate answers format
    if (!Array.isArray(answers)) {
      throw new ValidationError('Answers must be an array')
    }

    // Calculate results
    let correctCount = 0
    const questionResults = []

    topic.mcq_questions.forEach(question => {
      const userAnswer = answers.find(a => a.question_id === question.id)
      const userAnswerIndex = userAnswer?.user_answer ?? null
      const isCorrect = userAnswerIndex === question.correct_answer

      if (isCorrect) {
        correctCount++
      }

      questionResults.push({
        question_id: question.id,
        question: question.question,
        options: question.options,
        user_answer: userAnswerIndex,
        correct_answer: question.correct_answer,
        is_correct: isCorrect,
        explanation: question.explanation
      })
    })

    const totalQuestions = topic.mcq_questions.length
    const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0
    const passed = score >= topic.passing_score

    // Create attempt record if userId is provided
    if (userId) {
      try {
        await prisma.mcq_attempts.create({
          data: {
            user_id: userId,
            topic_id: topicId,
            score,
            total_questions: totalQuestions,
            correct_questions: correctCount,
            passed,
            completed_at: new Date()
          }
        })
      } catch (error) {
        console.error('Failed to create MCQ attempt record:', error)
        // Don't throw error, just log it - we still want to return results
      }
    }

    return {
      score,
      total_questions: totalQuestions,
      correct_questions: correctCount,
      passed,
      passing_score: topic.passing_score,
      answers: questionResults
    }
  }
}
