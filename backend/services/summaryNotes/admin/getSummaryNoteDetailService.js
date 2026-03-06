import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import idriveService from '#services/idrive.service'

export class GetSummaryNoteDetailService extends BaseService {
  static async call({ id }) {
    if (!id) {
      throw new ValidationError('Summary note ID is required')
    }

    const summaryNote = await prisma.summary_notes.findUnique({
      where: { unique_id: id },
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
              is_deleted: false
            }
          },
          include: {
            flashcard_deck: true
          }
        },
        summary_note_mcq_topics: {
          where: {
            mcq_topic: {
              is_deleted: false
            }
          },
          include: {
            mcq_topic: true
          }
        }
      }
    })

    if (!summaryNote || summaryNote.is_deleted) {
      throw new ValidationError('Summary note not found')
    }

    // Get source document attachment if exists
    const sourceAttachment = await prisma.attachments.findFirst({
      where: {
        record_type: 'summary_note',
        record_id: summaryNote.id,
        name: 'source_document'
      },
      include: {
        blob: true
      }
    })

    // Generate presigned URL if blob exists
    if (sourceAttachment?.blob) {
      const presignedUrl = await idriveService.getSignedUrl(sourceAttachment.blob.key, 3600)
      sourceAttachment.blob.url = presignedUrl
    }

    // Attach source document to summary note
    summaryNote.sourceAttachment = sourceAttachment

    return summaryNote
  }
}
