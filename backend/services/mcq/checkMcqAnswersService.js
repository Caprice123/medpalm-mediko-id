import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class CheckMcqAnswersService extends BaseService {
  static async call({ topicId, answers, userId }) {
    // Get topic with questions
    const topic = await prisma.mcq_topics.findUnique({
      where: {
        id: topicId,
        status: 'published'
      },
      include: {
        mcq_questions: true
      }
    })

    if (!topic) {
      throw new ValidationError('MCQ topic not found or not available')
    }

    // Process answers and calculate score
    const results = []
    let correctCount = 0

    for (const answer of answers) {
      const question = topic.mcq_questions.find(q => q.id === answer.questionId)

      if (!question) {
        throw new ValidationError(`Question ${answer.questionId} not found in this topic`)
      }

      const isCorrect = answer.userAnswer.toLowerCase() === question.correct_answer.toLowerCase()
      if (isCorrect) {
        correctCount++
      }

      results.push({
        questionId: question.id,
        question: question.question,
        image_url: question.image_url,
        option_a: question.option_a,
        option_b: question.option_b,
        option_c: question.option_c,
        option_d: question.option_d,
        userAnswer: answer.userAnswer.toLowerCase(),
        correctAnswer: question.correct_answer,
        isCorrect,
        explanation: question.explanation
      })

      // Update user progress if userId provided
      if (userId) {
        await prisma.user_mcq_progress.upsert({
          where: {
            user_id_question_id: {
              user_id: userId,
              question_id: answer.questionId
            }
          },
          update: {
            times_correct: isCorrect ? { increment: 1 } : undefined,
            times_incorrect: !isCorrect ? { increment: 1 } : undefined,
            last_reviewed: new Date()
          },
          create: {
            user_id: userId,
            question_id: answer.questionId,
            topic_id: topicId,
            times_correct: isCorrect ? 1 : 0,
            times_incorrect: !isCorrect ? 1 : 0,
            last_reviewed: new Date()
          }
        })
      }
    }

    // Calculate score (percentage)
    const totalQuestions = topic.mcq_questions.length
    const score = Math.round((correctCount / totalQuestions) * 100)
    const passed = score >= topic.passing_score

    return {
      score,
      correct_count: correctCount,
      total_questions: totalQuestions,
      passing_score: topic.passing_score,
      passed,
      results
    }
  }
}
