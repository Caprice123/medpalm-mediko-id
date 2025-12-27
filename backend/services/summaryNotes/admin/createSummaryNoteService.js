import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import embeddingService from '#services/embedding/embeddingService'

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
            recordType: 'summary_note',
            recordId: summaryNote.id,
            blobId: parseInt(blobId)
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

    // Auto-embed if status is 'published'
    if (result.status === 'published') {
      try {
        await embeddingService.embedSummaryNote(result)
      } catch (error) {
        console.error('Failed to embed summary note:', error)
        // Don't throw - note was created successfully, embedding is supplementary
      }
    }

    return result
  }
}
