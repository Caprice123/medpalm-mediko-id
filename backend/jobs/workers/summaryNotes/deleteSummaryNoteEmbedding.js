import embeddingService from '#services/embedding/embeddingService'

/**
 * Delete Summary Note Embedding Job Handler
 *
 * Removes all embeddings for a summary note from ChromaDB
 */
export async function deleteSummaryNoteEmbeddingHandler(job) {
  const { summaryNoteId } = job.data

  console.log(`🗑️  Deleting embeddings for note ${summaryNoteId}`)

  await embeddingService.deleteSummaryNoteEmbedding(summaryNoteId)

  console.log(`✓ Successfully deleted embeddings for note ${summaryNoteId}`)
}
