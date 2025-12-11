import prisma from '../../prisma/client.js'
import { BaseService } from '../baseService.js'
import { ValidationError } from '../../errors/validationError.js'

export class GetSummaryNoteSessionService extends BaseService {
  static async call({ userLearningSessionId, userId }) {
    if (!userLearningSessionId) {
      throw new ValidationError('User learning session ID is required')
    }

    // Get the summary note session
    const session = await prisma.summary_note_sessions.findUnique({
      where: { user_learning_session_id: parseInt(userLearningSessionId) },
      include: {
        user_learning_session: true,
        summary_note: {
          include: {
            summary_note_tags: {
              include: {
                tags: {
                  include: {
                    tag_group: true
                  }
                }
              }
            }
          }
        }
      }
    })

    if (!session) {
      throw new ValidationError('Summary note session not found')
    }

    // Verify user owns this session
    if (userId && session.user_learning_session.user_id !== parseInt(userId)) {
      throw new ValidationError('Unauthorized to view this session')
    }

    // Separate tags by group
    const allTags = session.summary_note.summary_note_tags.map(t => ({
      id: t.tags.id,
      name: t.tags.name,
      tagGroupId: t.tags.tag_group_id,
      tagGroupName: t.tags.tag_group?.name
    }))

    const universityTags = allTags.filter(tag => tag.tagGroupName === 'university')
    const semesterTags = allTags.filter(tag => tag.tagGroupName === 'semester')

    return {
      id: session.id,
      user_learning_session_id: session.user_learning_session_id,
      credits_used: session.credits_used,
      viewed_at: session.viewed_at,
      created_at: session.created_at,
      summaryNote: {
        id: session.summary_note.id,
        title: session.summary_note.title,
        description: session.summary_note.description,
        content: session.summary_note.content,
        tags: allTags,
        universityTags,
        semesterTags
      }
    }
  }
}
