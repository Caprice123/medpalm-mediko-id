import prisma from '../../prisma/client.js'
import { BaseService } from '../baseService.js'
import { ValidationError } from '../../errors/validationError.js'
import { GetConstantsService } from '../constant/getConstantsService.js'

export class StartExerciseWithTopicService extends BaseService {
  static async call({ userLearningSessionId, attemptId, exerciseTopicId, userId }) {
    // Get credit cost from constants BEFORE transaction
    const constants = await GetConstantsService.call(['exercise_credit_cost'])
    const creditCost = parseInt(constants.exercise_credit_cost)

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
          exercise_questions: {
            orderBy: { order: 'asc' }
          },
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

      // Check and deduct credits
      let userCredit = await tx.user_credits.findUnique({
        where: { userId: parseInt(userId) }
      })

      if (!userCredit || userCredit.balance < creditCost) {
        throw new ValidationError('Insufficient credits')
      }

      // Create topic snapshot
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
        questions: topic.exercise_questions.map((q, index) => ({
          id: q.id,
          question: q.question || '',
          answer: q.answer || '',
          explanation: q.explanation || '',
          order: q.order !== undefined ? q.order : index
        }))
      }

      // Create question snapshots for database
      const questionSnapshots = topic.exercise_questions.map((q, index) => ({
        exercise_session_id: attempt.exercise_session.id,
        question_text: q.question || '',
        answer_text: q.answer || '',
        explanation: q.explanation || '',
        order: q.order !== undefined ? q.order : index
      }))

      await tx.exercise_session_questions.createMany({
        data: questionSnapshots
      })

      // Update exercise session with topic
      await tx.exercise_sessions.update({
        where: { id: attempt.exercise_session.id },
        data: {
          exercise_topic_id: exerciseTopicId,
          total_question: topic.exercise_questions.length,
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
        where: { userId: parseInt(userId) },
        data: {
          balance: { decrement: creditCost }
        }
      })

      // Record credit transaction
      await tx.credit_transactions.create({
        data: {
          userId: parseInt(userId),
          userCreditId: userCredit.id,
          type: 'deduction',
          amount: -creditCost,
          balanceBefore: userCredit.balance,
          balanceAfter: userCredit.balance - creditCost,
          description: `Started exercise: ${topic.title}`,
          sessionId: attempt.exercise_session.id
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
