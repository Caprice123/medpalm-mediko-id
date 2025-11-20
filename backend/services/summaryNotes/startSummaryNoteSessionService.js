import prisma from '../../prisma/client.js'
import { BaseService } from '../baseService.js'
import { ValidationError } from '../../errors/validationError.js'
import { GetConstantsService } from '../constant/getConstantsService.js'

export class StartSummaryNoteSessionService extends BaseService {
  static async call({ userLearningSessionId, summaryNoteId, userId }) {
    // Validate inputs
    if (!userLearningSessionId || !summaryNoteId || !userId) {
      throw new ValidationError('User learning session ID, summary note ID, and user ID are required')
    }

    // Get credit cost from constants
    const constants = await GetConstantsService.call(['summary_notes_credit_cost'])
    const creditCost = parseInt(constants.summary_notes_credit_cost || 5)

    const result = await prisma.$transaction(async (tx) => {
      // Verify the user_learning_session exists and belongs to the user
      const userLearningSession = await tx.user_learning_sessions.findUnique({
        where: { id: parseInt(userLearningSessionId), user_id: userId },
        include: {
          summary_note_session: true
        }
      })

      if (!userLearningSession) {
        throw new ValidationError('Learning session not found')
      }

      // Check if already has a summary note session
      if (userLearningSession.summary_note_session) {
        throw new ValidationError('Summary note already selected for this session')
      }

      // Get the summary note
      const summaryNote = await tx.summary_notes.findUnique({
        where: { id: parseInt(summaryNoteId) },
        include: {
          summary_note_tags: {
            include: {
              tags: true
            }
          }
        }
      })

      if (!summaryNote) {
        throw new ValidationError('Summary note not found')
      }

      if (!summaryNote.is_active || summaryNote.status !== 'published') {
        throw new ValidationError('Summary note is not available')
      }

      // Check and deduct credits
      let userCredit = await tx.user_credits.findUnique({
        where: { userId: parseInt(userId) }
      })

      if (!userCredit || userCredit.balance < creditCost) {
        throw new ValidationError('Insufficient credits')
      }

      // Create summary note session
      const summaryNoteSession = await tx.summary_note_sessions.create({
        data: {
          user_learning_session_id: parseInt(userLearningSessionId),
          summary_note_id: parseInt(summaryNoteId),
          credits_used: creditCost
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
          description: `Viewed summary note: ${summaryNote.title}`,
          sessionId: summaryNoteSession.id
        }
      })

      return {
        session: summaryNoteSession,
        summaryNote: {
          id: summaryNote.id,
          title: summaryNote.title,
          description: summaryNote.description,
          content: summaryNote.content,
          tags: summaryNote.summary_note_tags.map(t => ({
            id: t.tags.id,
            name: t.tags.name,
            type: t.tags.type
          }))
        },
        creditsUsed: creditCost
      }
    })

    return result
  }
}
