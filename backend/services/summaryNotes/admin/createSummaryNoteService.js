import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import { queueEmbedSummaryNote } from '#jobs/queues/summaryNotesQueue'

export class CreateSummaryNoteService extends BaseService {
  static async call({ title, description, content, markdownContent, blobId, status, tagIds, createdBy }) {
    // Validate required fields
    if (!title) {
      throw new ValidationError('Title is required')
    }

    if (!content) {
      throw new ValidationError('Content is required')
    }

    if (!createdBy) {
      throw new ValidationError('Created by is required')
    }

    // Validate blob exists if provided
    if (blobId) {
      const blob = await prisma.blobs.findUnique({
        where: { id: parseInt(blobId) }
      })
      if (!blob) {
        throw new ValidationError('Invalid blob ID')
      }
    }

    const result = await prisma.$transaction(async (tx) => {
      // Create the summary note
      const summaryNote = await tx.summary_notes.create({
        data: {
          title,
          description: description || null,
          content,
          markdown_content: markdownContent || null,
          status: status || 'draft',
          created_by: createdBy
        }
      })

      // Create tag associations if provided
      if (tagIds && tagIds.length > 0) {
        await tx.summary_note_tags.createMany({
          data: tagIds.map(tagId => ({
            summary_note_id: summaryNote.id,
            tag_id: tagId
          }))
        })
      }

      // Create attachment for source document if blobId provided
      if (blobId) {
        await tx.attachments.create({
          data: {
            name: 'source_document',
            record_type: 'summary_note',
            record_id: summaryNote.id,
            blob_id: parseInt(blobId)
          }
        })
      }

      // Fetch the complete summary note with tags
      const completeSummaryNote = await tx.summary_notes.findUnique({
        where: { id: summaryNote.id },
        include: {
          summary_note_tags: {
            include: {
              tags: true
            }
          }
        }
      })

      return completeSummaryNote
    })

    // Queue embedding job if status is 'published'
    if (result.status === 'published') {
      try {
        await queueEmbedSummaryNote(result.id)
        console.log(`✓ Queued embedding job for summary note ${result.id}`)
      } catch (error) {
        console.error('Failed to queue embedding job:', error)
        // Don't throw - note was created successfully, embedding is supplementary
      }
    }

    return result
  }
}
