import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import { AuthorizationError } from '#errors/authorizationError'
import attachmentService from '#services/attachment/attachmentService'
import { checkAccessAndDeductCredit } from '#services/shared/checkAccessAndDeductCreditService'
import { TrackRecentlyViewedService } from '#services/recentlyViewed/trackRecentlyViewedService'

export class GetSummaryNoteDetailV2Service extends BaseService {
  static async call({ noteId, userId, userRole = 'user' }) {
    if (!noteId) throw new ValidationError('Note ID wajib diisi')

    const note = await prisma.$transaction(async (tx) => {
      const note = await tx.summary_notes.findUnique({
        where: { unique_id: noteId },
        include: {
          summary_note_tags: {
            include: { tags: { include: { tag_group: true } } }
          },
          summary_note_flashcard_decks: {
            where: { flashcard_deck: { status: 'published', is_deleted: false } },
            include: { flashcard_deck: true }
          },
          summary_note_mcq_topics: {
            where: { mcq_topic: { status: 'published', is_deleted: false } },
            include: { mcq_topic: true }
          }
        }
      })

      if (!note || note.is_deleted) throw new ValidationError('Ringkasan tidak ditemukan')
      if (userRole === 'user' && note.status !== 'published') {
        throw new AuthorizationError('Ringkasan ini tidak tersedia')
      }

      await checkAccessAndDeductCredit(tx, {
        userId,
        userRole,
        accessTypeKey: 'summary_notes_access_type',
        creditCostKey: 'summary_notes_credit_cost',
        description: `Viewed summary note: ${note.id} - ${note.title}`,
        featureKey: 'summary_notes',
      })

      return note
    })

    const sourceAttachment = await attachmentService.getAttachmentWithUrl(
      'summary_note', parseInt(note.id), 'source_document', 3600
    )
    note.sourceAttachment = sourceAttachment

    // Fetch node records with full ancestor path (up to 3 levels deep)
    const nodeRecords = await prisma.feature_node_records.findMany({
      where: { record_type: 'summary_note', record_id: note.id },
      include: {
        node: {
          include: {
            parent: {
              include: {
                parent: {
                  include: { parent: true }
                }
              }
            }
          }
        }
      }
    })
    note.nodeRecords = nodeRecords

    // Track recently viewed (fire-and-forget, don't block the response)
    TrackRecentlyViewedService.call({
      userId,
      recordType: 'summary_note',
      recordId: note.id,
      metadata: { title: note.title, uniqueId: note.unique_id }
    }).catch(() => {})

    return note
  }
}
