import prisma from '../../prisma/client.js'
import { BaseService } from '../baseService.js'
import { ValidationError } from '../../errors/validationError.js'
import { HasActiveSubscriptionService } from '../pricing/getUserStatusService.js'

export class StartExerciseTopicService extends BaseService {
  static async call({ exerciseTopicId, userId }) {
    const result = await prisma.$transaction(async (tx) => {
      // Check if user has active subscription
      const hasSubscription = await HasActiveSubscriptionService.call(parseInt(userId))

      if (!hasSubscription) {
        throw new ValidationError('Active subscription required to access exercises')
      }
      // Get the topic with questions
      const topic = await tx.exercise_topics.findUnique({
        where: { id: parseInt(exerciseTopicId) },
        include: {
          exercise_questions: true,
          exercise_topic_tags: {
            include: { tags: true }
          }
        }
      })

      if (!topic) {
        throw new ValidationError('Topic not found')
      }

      if (!topic.exercise_questions || topic.exercise_questions.length === 0) {
        throw new ValidationError('Topic has no questions')
      }

      // Get user's historical performance for this topic (from user_question_progress)
      const questionIds = topic.exercise_questions.map(q => q.id)
      const userProgress = await tx.user_question_progress.findMany({
        where: {
          user_id: parseInt(userId),
          question_id: { in: questionIds }
        }
      })

      // Create progress map: question_id -> { times_correct, times_incorrect }
      const progressMap = {}
      userProgress.forEach(progress => {
        progressMap[progress.question_id] = {
          times_correct: progress.times_correct,
          times_incorrect: progress.times_incorrect,
          last_reviewed: progress.last_reviewed
        }
      })

      // Calculate weight for each question and apply weighted randomization
      const questionsWithWeights = topic.exercise_questions.map(question => {
        const progress = progressMap[question.id] || {
          times_correct: 0,
          times_incorrect: 0,
          last_reviewed: new Date(0)
        }

        // Weight calculation (same as flashcards):
        // - Base weight: 1
        // - Add 3 for each incorrect answer
        // - Subtract 0.5 for each correct answer
        const weight = Math.max(
          1, // Minimum weight of 1
          1 +
          (progress.times_incorrect * 3) -
          (progress.times_correct * 0.5)
        )

        return { question, weight, progress }
      })

      // Weighted random shuffle
      const shuffledQuestions = []
      const remainingQuestions = [...questionsWithWeights]

      while (remainingQuestions.length > 0) {
        // Calculate total weight
        const totalWeight = remainingQuestions.reduce((sum, item) => sum + item.weight, 0)

        // Pick random based on weights
        let random = Math.random() * totalWeight
        let selectedIndex = 0

        for (let i = 0; i < remainingQuestions.length; i++) {
          random -= remainingQuestions[i].weight
          if (random <= 0) {
            selectedIndex = i
            break
          }
        }

        shuffledQuestions.push(remainingQuestions[selectedIndex].question)
        remainingQuestions.splice(selectedIndex, 1)
      }

      // Create topic snapshot using shuffled questions
      const topicSnapshot = {
        id: topic.id,
        title: topic.title || 'Untitled',
        description: topic.description || '',
        content_type: topic.content_type || 'text',
        tags: (topic.exercise_topic_tags || []).map(t => ({
          id: t.tags?.id || t.id,
          name: t.tags?.name || t.name || '',
          type: t.tags?.type || t.type || ''
        })),
        questions: shuffledQuestions.map((q, index) => ({
          id: q.id,
          question: q.question || '',
          answer: q.answer || '',
          explanation: q.explanation || '',
          order: index // Use new shuffled order
        })),
        totalQuestions: shuffledQuestions.length
      }

      return {
        topic: topicSnapshot
      }
    })

    return result
  }
}
