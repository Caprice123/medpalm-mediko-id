import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { NotFoundError } from '#errors/notFoundError'
import { ValidationError } from '#errors/validationError'

export class SubmitMcqAnswersService extends BaseService {
  static async call({ topicId, answers, userId }) {
    return await prisma.$transaction(async (tx) => {
      // Get topic with questions
      const topic = await tx.mcq_topics.findFirst({
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

      // Update user_mcq_progress for persistent tracking (spaced repetition)
      const userIdInt = parseInt(userId)
      const topicIdInt = parseInt(topicId)

      for (const result of questionResults) {
        await tx.user_mcq_progress.upsert({
          where: {
            user_id_question_id: {
              user_id: userIdInt,
              question_id: result.question_id
            }
          },
          create: {
            user_id: userIdInt,
            question_id: result.question_id,
            topic_id: topicIdInt,
            times_correct: result.is_correct ? 1 : 0,
            times_incorrect: result.is_correct ? 0 : 1,
            last_reviewed: new Date()
          },
          update: result.is_correct
            ? {
                times_correct: { increment: 1 },
                last_reviewed: new Date(),
                updated_at: new Date()
              }
            : {
                times_incorrect: { increment: 1 },
                last_reviewed: new Date(),
                updated_at: new Date()
              }
        })
      }

      const totalQuestions = topic.mcq_questions.length
      const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0
      const passed = score >= topic.passing_score

      return {
        score,
        totalQuestions: totalQuestions,
        correctQuestions: correctCount,
        passed,
        passingScore: topic.passing_score,
        answers: questionResults
      }
    })
  }
}
