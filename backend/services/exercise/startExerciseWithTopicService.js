import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import { GetConstantsService } from '#services/constant/getConstantsService'
import idriveService from '#services/idrive.service'

export class StartExerciseWithTopicService extends BaseService {
  static async call({ userLearningSessionId, attemptId, exerciseTopicId, userId }) {
    // Get credit cost from constants BEFORE transaction
    const constants = await GetConstantsService.call(['exercise_credit_cost'])
    const creditCost = parseFloat(constants.exercise_credit_cost)

    const result = await prisma.$transaction(async (tx) => {
      // Get the attempt directly
      const attempt = await tx.exercise_session_attempts.findUnique({
        where: { id: parseInt(attemptId) },
        include: {
          exercise_session: {
            include: {
              user_learning_session: true
            }
          }
        }
      })

      if (!attempt) {
        throw new ValidationError('Attempt not found')
      }

      // Verify user owns this attempt
      if (attempt.exercise_session.user_learning_session.user_id !== parseInt(userId)) {
        throw new ValidationError('Unauthorized')
      }

      // Verify the attempt belongs to the specified learning session
      if (attempt.exercise_session.user_learning_session_id !== parseInt(userLearningSessionId)) {
        throw new ValidationError('Attempt does not belong to this session')
      }

      // Check if topic already selected
      if (attempt.exercise_session.exercise_topic_id) {
        throw new ValidationError("You have already selected a topic")
      }

      // Check if attempt is in correct state
      if (attempt.status !== 'not_started') {
        throw new ValidationError('Attempt has already been started')
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

      // Get user's historical performance for this topic to implement weighted randomization
      // Find all previous attempts for this user on this topic
      const previousAttempts = await tx.exercise_session_attempts.findMany({
        where: {
          exercise_session: {
            user_learning_session: {
              user_id: parseInt(userId)
            },
            exercise_topic_id: parseInt(exerciseTopicId)
          },
          status: 'completed'
        },
        include: {
          exercise_session_answers: {
            include: {
              exercise_session_questions: true
            }
          }
        }
      })

      // Build performance map: question_text -> { correct, incorrect }
      const performanceMap = {}
      previousAttempts.forEach(attempt => {
        attempt.exercise_session_answers.forEach(answer => {
          const questionText = answer.exercise_session_questions.question_text
          if (!performanceMap[questionText]) {
            performanceMap[questionText] = { times_correct: 0, times_incorrect: 0 }
          }
          if (answer.is_correct) {
            performanceMap[questionText].times_correct++
          } else {
            performanceMap[questionText].times_incorrect++
          }
        })
      })

      // Calculate weight for each question and apply weighted randomization
      const questionsWithWeights = topic.exercise_questions.map(question => {
        const performance = performanceMap[question.question] || {
          times_correct: 0,
          times_incorrect: 0
        }

        // Weight calculation (same as flashcards):
        // - Base weight: 1
        // - Add 3 for each incorrect answer
        // - Subtract 0.5 for each correct answer
        const weight = Math.max(
          1, // Minimum weight of 1
          1 +
          (performance.times_incorrect * 3) -
          (performance.times_correct * 0.5)
        )

        return { question, weight, performance }
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

      // Check and deduct credits
      let userCredit = await tx.user_credits.findUnique({
        where: { user_id: parseInt(userId) }
      })

      if (!userCredit || userCredit.balance < creditCost) {
        throw new ValidationError('Insufficient credits')
      }

      // Fetch image attachments for all questions
      const questionIds = shuffledQuestions.map(q => q.id)
      const questionAttachments = await tx.attachments.findMany({
        where: {
          record_type: 'exercise_question',
          record_id: { in: questionIds },
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
          image: attachmentMap[q.id] || null,
          order: index // Use new shuffled order
        }))
      }

      // Create question snapshots for database using shuffled order
      const questionSnapshots = shuffledQuestions.map((q, index) => ({
        exercise_session_id: attempt.exercise_session.id,
        question_text: q.question || '',
        answer_text: q.answer || '',
        explanation: q.explanation || '',
        order: index // Use new shuffled order
      }))

      await tx.exercise_session_questions.createMany({
        data: questionSnapshots
      })

      // Update exercise session with topic
      await tx.exercise_sessions.update({
        where: { id: attempt.exercise_session.id },
        data: {
          exercise_topic_id: exerciseTopicId,
          total_question: shuffledQuestions.length,
          credits_used: creditCost
        }
      })

      // Update attempt to active
      const updatedAttempt = await tx.exercise_session_attempts.update({
        where: { id: attempt.id },
        data: {
          status: 'active'
        }
      })

      // Deduct credits
      await tx.user_credits.update({
        where: { user_id: parseInt(userId) },
        data: {
          balance: { decrement: creditCost }
        }
      })

      // Record credit transaction
      await tx.credit_transactions.create({
        data: {
          user_id: parseInt(userId),
          user_credit_id: userCredit.id,
          type: 'deduction',
          amount: -creditCost,
          balance_before: userCredit.balance,
          balance_after: userCredit.balance - creditCost,
          description: `Started exercise: ${topic.title}`,
          session_id: attempt.exercise_session.id
        }
      })

      return {
        attempt: updatedAttempt,
        topicSnapshot
      }
    })

    return result
  }
}
