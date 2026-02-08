import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import { HasActiveSubscriptionService } from '#services/pricing/getUserStatusService'

export class StartAnatomyQuizService extends BaseService {
  static async call({ quizId, userId }) {
    const result = await prisma.$transaction(async tx => {
      // Check if user has active subscription (REQUIRED)
      const hasSubscription = await HasActiveSubscriptionService.call(parseInt(userId))

      if (!hasSubscription) {
        throw new ValidationError('Active subscription required to access anatomy quizzes')
      }

      // Get the quiz with questions
      const quiz = await tx.anatomy_quizzes.findUnique({
        where: { unique_id: quizId },
        include: {
          anatomy_questions: {
            orderBy: { order: 'asc' }
          },
          anatomy_quiz_tags: {
            include: { tags: true }
          }
        }
      })

      if (!quiz) {
        throw new ValidationError('Quiz not found')
      }

      if (quiz.status !== 'published') {
        throw new ValidationError('Quiz is not available')
      }

      if (!quiz.anatomy_questions || quiz.anatomy_questions.length === 0) {
        throw new ValidationError('Quiz has no questions')
      }

      // Get user's progress for questions in this quiz to implement spaced repetition
      const questionIds = quiz.anatomy_questions.map(q => q.id)
      const userProgress = await tx.user_anatomy_progress.findMany({
        where: {
          user_id: parseInt(userId),
          question_id: { in: questionIds }
        }
      })

      // Create progress map: question_id -> progress data
      const progressMap = {}
      userProgress.forEach(progress => {
        progressMap[progress.question_id] = progress
      })

      // Calculate weight for each question based on performance
      // Higher weight = more likely to appear earlier
      const questionsWithWeights = quiz.anatomy_questions.map(question => {
        const progress = progressMap[question.id] || {
          times_incorrect: 0,
          times_correct: 0,
          last_reviewed: new Date(0)
        }

        // Weight calculation (same algorithm as flashcards):
        // - Base weight: 1
        // - Add 3 for each incorrect answer (heavily prioritize difficult questions)
        // - Subtract 0.5 for each correct answer (slightly deprioritize mastered questions)
        // - Add recency bonus for questions not reviewed recently
        const daysSinceReview =
          (Date.now() - new Date(progress.last_reviewed)) / (1000 * 60 * 60 * 24)
        const recencyBonus = Math.min(daysSinceReview / 7, 2) // Max 2 bonus for >2 weeks

        const weight = Math.max(
          1, // Minimum weight of 1
          1 + progress.times_incorrect * 3 - progress.times_correct * 0.5 + recencyBonus
        )

        return { question, weight, progress }
      })

      // Weighted random shuffle using cumulative weights
      const sortedQuestions = []
      const remainingQuestions = [...questionsWithWeights]

      while (remainingQuestions.length > 0) {
        // Calculate total weight of remaining questions
        const totalWeight = remainingQuestions.reduce((sum, item) => sum + item.weight, 0)

        // Pick a random number between 0 and total weight
        let random = Math.random() * totalWeight

        // Find which question this random number corresponds to
        let selectedIndex = 0
        for (let i = 0; i < remainingQuestions.length; i++) {
          random -= remainingQuestions[i].weight
          if (random <= 0) {
            selectedIndex = i
            break
          }
        }

        // Add selected question to result and remove from remaining
        sortedQuestions.push(remainingQuestions[selectedIndex].question)
        remainingQuestions.splice(selectedIndex, 1)
      }

      // Create quiz attempt directly (no sessions)
      const attempt = await tx.anatomy_quiz_attempts.create({
        data: {
          user_id: parseInt(userId),
          quiz_id: quiz.id,
          total_questions: sortedQuestions.length,
          status: 'in_progress'
        }
      })

      // Return quiz data with sorted questions
      const quizSnapshot = {
        id: quiz.id,
        uniqueId: quiz.unique_id,
        title: quiz.title,
        description: quiz.description,
        image_url: quiz.image_url,
        attemptId: attempt.id,
        tags: (quiz.anatomy_quiz_tags || []).map(t => ({
          id: t.tags?.id || t.id,
          name: t.tags?.name || t.name || '',
          tagGroupId: t.tags?.tag_group_id
        })),
        questions: sortedQuestions.map(q => ({
          id: q.id,
          question: q.question,
          order: q.order
          // Note: answer and explanation are NOT included (will be revealed after submission)
        })),
        totalQuestions: sortedQuestions.length
      }

      return {
        quiz: quizSnapshot
      }
    })

    return result
  }

  static validate({ quizId, userId }) {
    if (!quizId || typeof quizId !== 'string') {
      throw new ValidationError('Quiz ID is required')
    }

    if (!userId) {
      throw new ValidationError('User ID is required')
    }
  }
}
