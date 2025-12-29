import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class GetMcqTopicSessionService extends BaseService {
  static async call({ topicId, mode, userId }) {
    // Validate mode
    if (!['learning', 'quiz'].includes(mode)) {
      throw new ValidationError('Mode must be either "learning" or "quiz"')
    }

    // Get topic with questions
    const topic = await prisma.mcq_topics.findUnique({
      where: {
        id: topicId,
        is_active: true,
        status: 'published'
      },
      include: {
        mcq_questions: {
          orderBy: { order: 'asc' }
        }
      }
    })

    if (!topic) {
      throw new ValidationError('MCQ topic not found or not available')
    }

    if (topic.mcq_questions.length === 0) {
      throw new ValidationError('This topic has no questions')
    }

    // Get user progress if userId provided
    let userProgress = []
    if (userId) {
      userProgress = await prisma.user_mcq_progress.findMany({
        where: {
          user_id: userId,
          topic_id: topicId
        }
      })
    }

    // NOTE: Returns raw Prisma data with user progress attached
    // Serializers will handle transformation and security (hiding answers in quiz mode)

    // Attach user progress to questions
    const questionsWithProgress = topic.mcq_questions.map(q => {
      const questionData = { ...q }

      if (userId) {
        const progress = userProgress.find(p => p.question_id === q.id)
        if (progress) {
          questionData.userProgress = {
            times_correct: progress.times_correct,
            times_incorrect: progress.times_incorrect,
            last_reviewed: progress.last_reviewed
          }
        }
      }

      return questionData
    })

    return {
      topic: {
        ...topic,
        mcq_questions: questionsWithProgress
      },
      mode
    }
  }
}
