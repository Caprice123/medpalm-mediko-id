import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import attachmentService from '#services/attachment/attachmentService'

export class GetSummaryNoteByIdService extends BaseService {
  static async call({ noteId }) {
    if (!noteId) {
      throw new ValidationError('Note ID is required')
    }

    // Get the summary note
    const note = await prisma.summary_notes.findUnique({
      where: {
        unique_id: noteId,
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
        },
        summary_note_flashcard_decks: {
          where: {
            flashcard_deck: {
              status: 'published'
            }
          },
          include: {
            flashcard_deck: true
          }
        },
        summary_note_mcq_topics: {
          where: {
            mcq_topic: {
              status: 'published'
            }
          },
          include: {
            mcq_topic: true
          }
        }
      }
    })

    if (!note) {
      throw new ValidationError('Summary note not found')
    }

    // Get source document attachment if exists
    const sourceAttachment = await attachmentService.getAttachmentWithUrl(
      'summary_note',
      parseInt(noteId),
      'source_document',
      3600 // 1 hour expiration
    )

    // Attach source document to summary note
    note.sourceAttachment = sourceAttachment

    // Return raw Prisma data - serializers handle transformation
    return note
  }
}
