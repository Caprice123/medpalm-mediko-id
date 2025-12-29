import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'

export class GetSummaryNoteByIdService extends BaseService {
  static async call({ noteId }) {
    if (!noteId) {
      throw new ValidationError('Note ID is required')
    }

    // Get the summary note
    const note = await prisma.summary_notes.findUnique({
      where: {
        id: parseInt(noteId),
        is_active: true,
        status: 'published'
      },
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
    })

    if (!note) {
      throw new ValidationError('Summary note not found')
    }

    // Return raw Prisma data - serializers handle transformation
    return note
  }
}
