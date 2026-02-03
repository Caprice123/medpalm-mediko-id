import embeddingService from '#services/embedding/embeddingService'
import { ValidationError } from '#errors/validationError'

/**
 * Delete Summary Note Embedding Job Handler
 *
 * Removes all embeddings for a summary note from ChromaDB
 */
export async function deleteSummaryNoteEmbeddingHandler(job) {
  const { summaryNoteId } = job.data

  if (!summaryNoteId) {
    throw new ValidationError('Summary note ID is required')
  }

  console.log(`🗑️  Deleting embeddings for note ${summaryNoteId}`)

  await embeddingService.deleteSummaryNoteEmbedding(summaryNoteId)

  console.log(`✓ Successfully deleted embeddings for note ${summaryNoteId}`)
}
