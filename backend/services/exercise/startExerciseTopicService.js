import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import { HasActiveSubscriptionService } from '#services/pricing/getUserStatusService'
import idriveService from '#services/idrive.service'

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

      // Fetch image attachments for all questions
      const ids = shuffledQuestions.map(q => q.id)
      const questionAttachments = await tx.attachments.findMany({
        where: {
          record_type: 'exercise_question',
          record_id: { in: ids },
          name: 'image'
        },
        include: {
          blob: true
        }
      })

      // Create a map of question_id -> attachment for quick lookup
      const attachmentMap = {}
      for (const att of questionAttachments) {
        if (att.blob) {
          const imageUrl = await idriveService.getSignedUrl(att.blob.key, 7 * 24 * 60 * 60)
          attachmentMap[att.record_id] = {
            blobId: att.blob_id,
            url: imageUrl,
            key: att.blob.key,
            filename: att.blob.filename
          }
        }
      }

      // Create topic snapshot using shuffled questions
      // NOTE: Do NOT include answer or explanation here - they should only be sent after submission
      const topicSnapshot = {
        id: topic.id,
        title: topic.title || 'Untitled',
        description: topic.description || '',
        exercise_topic_tags: topic.exercise_topic_tags || [],
        questions: shuffledQuestions.map((q, index) => ({
          id: q.id,
          question: q.question || '',
          image: attachmentMap[q.id] || null,
          order: index // Use new shuffled order
        }))
      }

      return {
        topic: topicSnapshot
      }
    })

    return result
  }
}
