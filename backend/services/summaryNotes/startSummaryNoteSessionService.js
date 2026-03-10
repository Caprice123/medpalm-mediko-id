import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import { checkAccessAndDeductCredit } from '#services/shared/checkAccessAndDeductCreditService'

export class StartSummaryNoteSessionService extends BaseService {
  static async call({ userLearningSessionId, summaryNoteId, userId, userRole = 'user' }) {
    if (!userLearningSessionId || !summaryNoteId || !userId) {
      throw new ValidationError('User learning session ID, summary note ID, and user ID are required')
    }

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

      if (!summaryNote || summaryNote.is_deleted) {
        throw new ValidationError('Summary note not found')
      }

      if (userRole === 'user' && summaryNote.status !== 'published') {
        throw new ValidationError('Summary note is not available')
      }

      await checkAccessAndDeductCredit(tx, {
        userId,
        userRole,
        accessTypeKey: 'summary_notes_access_type',
        creditCostKey: 'summary_notes_credit_cost',
        description: `Viewed summary note: ${summaryNote.id} - ${summaryNote.title}`
      })

      // Create summary note session
      const summaryNoteSession = await tx.summary_note_sessions.create({
        data: {
          user_learning_session_id: parseInt(userLearningSessionId),
          summary_note_id: parseInt(summaryNoteId),
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
        creditsUsed: 0
      }
    })

    return result
  }
}
