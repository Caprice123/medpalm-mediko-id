import { ValidationError } from '../../errors/validationError.js'
import prisma from '../../prisma/client.js'
import { BaseService } from '../baseService.js'

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

    // Format questions based on mode
    const questions = topic.mcq_questions.map(q => {
      const question = {
        id: q.id,
        question: q.question,
        image_url: q.image_url,
        option_a: q.option_a,
        option_b: q.option_b,
        option_c: q.option_c,
        option_d: q.option_d,
        order: q.order
      }

      // In learning mode, include explanation but not correct answer
      if (mode === 'learning') {
        question.explanation = q.explanation
      }

      // Add user progress if available
      if (userId) {
        const progress = userProgress.find(p => p.question_id === q.id)
        if (progress) {
          question.userProgress = {
            times_correct: progress.times_correct,
            times_incorrect: progress.times_incorrect,
            last_reviewed: progress.last_reviewed
          }
        }
      }

      return question
    })

    return {
      topic: {
        id: topic.id,
        title: topic.title,
        description: topic.description,
        quiz_time_limit: topic.quiz_time_limit,
        passing_score: topic.passing_score
      },
      mode,
      questions
    }
  }
}
