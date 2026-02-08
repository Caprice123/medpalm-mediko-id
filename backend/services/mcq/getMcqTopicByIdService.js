import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { NotFoundError } from '#errors/notFoundError'

export class GetMcqTopicByIdService extends BaseService {
  static async call({ topicId, userId }) {
    return await prisma.$transaction(async (tx) => {
      const topic = await tx.mcq_topics.findFirst({
        where: {
          unique_id: topicId,
          status: 'published'
        },
        include: {
          mcq_questions: {
            orderBy: {
              order: 'asc'
            }
          },
          mcq_topic_tags: {
            include: {
              tags: {
                include: {
                  tag_group: true
                }
              }
            }
          }
        }
      })

      if (!topic) {
        throw new NotFoundError('MCQ topic not found or not published')
      }

      // If userId is provided, implement spaced repetition
      if (userId) {
        // Get user's historical performance for this topic
        const questionIds = topic.mcq_questions.map(q => q.id)
        const userProgress = await tx.user_mcq_progress.findMany({
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
        const questionsWithWeights = topic.mcq_questions.map(question => {
          const progress = progressMap[question.id] || {
            times_incorrect: 0,
            times_correct: 0,
            last_reviewed: new Date(0)
          }

          // Weight calculation (same algorithm as exercise/flashcards):
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

        // Return topic with sorted questions
        return {
          ...topic,
          mcq_questions: sortedQuestions
        }
      }

      // NOTE: Returns raw Prisma data - serializers handle transformation
      // SECURITY: This service returns full question data including correct_answer
      // Should ONLY be used with serializers that control what gets exposed
      return topic
    })
  }
}
