import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import embeddingService from '#services/embedding/embeddingService'

export class DeleteSummaryNoteService extends BaseService {
  static async call({ id }) {
    if (!id) {
      throw new ValidationError('Summary note ID is required')
    }

    // Check if summary note exists
    const existing = await prisma.summary_notes.findUnique({
      where: { unique_id: id }
    })

    if (!existing) {
      throw new ValidationError('Summary note not found')
    }

    await prisma.summary_notes.update({
      where: { id: existing.id },
      data: {
        is_deleted: true,
        deleted_at: new Date()
      }
    })

    // Delete embedding from ChromaDB if it was published
    if (existing.status === 'published') {
      try {
        await embeddingService.deleteSummaryNoteEmbedding(existing.unique_id)
      } catch (error) {
        console.error('Failed to delete embedding for summary note:', error)
        // Don't throw - note was deleted successfully
      }
    }

    return { success: true }
  }
}
