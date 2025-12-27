import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import embeddingService from '#services/embedding/embeddingService'

export class UpdateSummaryNoteService extends BaseService {
  static async call({ id, title, description, content, markdownContent, blobId, status, isActive, tagIds }) {
    // Validate required fields
    if (!id) {
      throw new ValidationError('Summary note ID is required')
    }

    // Check if summary note exists
    const existing = await prisma.summary_notes.findUnique({
      where: { id: parseInt(id) }
    })

    if (!existing) {
      throw new ValidationError('Summary note not found')
    }

    // Validate blob exists if provided
    if (blobId !== undefined && blobId !== null) {
      const blob = await prisma.blobs.findUnique({
        where: { id: parseInt(blobId) }
      })
      if (!blob) {
        throw new ValidationError('Invalid blob ID')
      }
    }

    const result = await prisma.$transaction(async (tx) => {
      // Build update data
      const updateData = {
        updated_at: new Date()
      }

      if (title !== undefined) updateData.title = title
      if (description !== undefined) updateData.description = description
      if (content !== undefined) updateData.content = content
      if (markdownContent !== undefined) updateData.markdown_content = markdownContent
      if (status !== undefined) updateData.status = status
      if (isActive !== undefined) updateData.is_active = isActive

      // Update the summary note
      const summaryNote = await tx.summary_notes.update({
        where: { id: parseInt(id) },
        data: updateData
      })

      // Update tag associations if provided
      if (tagIds !== undefined) {
        // Delete existing tags
        await tx.summary_note_tags.deleteMany({
          where: { summary_note_id: parseInt(id) }
        })

        // Create new tag associations
        if (tagIds.length > 0) {
          await tx.summary_note_tags.createMany({
            data: tagIds.map(tagId => ({
              summary_note_id: summaryNote.id,
              tag_id: tagId
            }))
          })
        }
      }

      // Update source document attachment if blobId provided
      if (blobId !== undefined) {
        // Delete existing source document attachment
        await tx.attachments.deleteMany({
          where: {
            recordType: 'summary_note',
            recordId: parseInt(id),
            name: 'source_document'
          }
        })

        // Create new attachment if blobId is not null
        if (blobId) {
          await tx.attachments.create({
            data: {
              name: 'source_document',
              recordType: 'summary_note',
              recordId: parseInt(id),
              blobId: parseInt(blobId)
            }
          })
        }
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

    // Handle embedding updates
    try {
      const wasPublished = existing.status === 'published'
      const isPublished = result.status === 'published'

      if (!wasPublished && isPublished) {
        // Status changed from draft to published → create embedding
        await embeddingService.embedSummaryNote(result)
      } else if (wasPublished && !isPublished) {
        // Status changed from published to draft → delete embedding
        await embeddingService.deleteSummaryNoteEmbedding(result.id)
      } else if (isPublished) {
        // Still published → update embedding (in case content changed)
        await embeddingService.embedSummaryNote(result)
      }
    } catch (error) {
      console.error('Failed to update embedding for summary note:', error)
      // Don't throw - note was updated successfully, embedding is supplementary
    }

    return result
  }
}
