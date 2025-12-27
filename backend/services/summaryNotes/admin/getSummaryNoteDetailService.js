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
      where: { id: parseInt(id) },
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

    if (!summaryNote) {
      throw new ValidationError('Summary note not found')
    }

    // Get source document attachment if exists
    const sourceAttachment = await prisma.attachments.findFirst({
      where: {
        recordType: 'summary_note',
        recordId: parseInt(id),
        name: 'source_document'
      },
      include: {
        blob: true
      }
    })

    // Separate tags by group (matching Anatomy Quiz pattern)
    const allTags = summaryNote.summary_note_tags.map(t => ({
      id: t.tags.id,
      name: t.tags.name,
      tagGroupId: t.tags.tag_group_id,
      tagGroupName: t.tags.tag_group?.name
    }))

    const universityTags = allTags.filter(tag => tag.tagGroupName === 'university')
    const semesterTags = allTags.filter(tag => tag.tagGroupName === 'semester')

    // Generate presigned URL for source document if exists
    let sourceUrl = null
    let sourceFilename = null
    let sourceContentType = null
    if (sourceAttachment?.blob) {
      sourceUrl = await idriveService.getSignedUrl(sourceAttachment.blob.key)
      sourceFilename = sourceAttachment.blob.filename
      sourceContentType = sourceAttachment.blob.contentType
    }

    return {
      id: summaryNote.id,
      title: summaryNote.title,
      description: summaryNote.description,
      content: summaryNote.content,
      blobId: sourceAttachment?.blobId || null,
      sourceUrl,
      sourceFilename,
      sourceContentType,
      status: summaryNote.status,
      is_active: summaryNote.is_active,
      created_by: summaryNote.created_by,
      created_at: summaryNote.created_at,
      updated_at: summaryNote.updated_at,
      tags: allTags,
      universityTags,
      semesterTags
    }
  }
}
