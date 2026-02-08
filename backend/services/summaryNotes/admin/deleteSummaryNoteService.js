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

    // Delete the summary note (cascade will handle tags)
    await prisma.summary_notes.delete({
      where: { unique_id: id }
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
