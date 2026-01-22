import { getVectorDB } from '#services/vectorDB/vectorDBFactory'
import embeddingService from '#services/embedding/embeddingService'
import MarkdownChunker from '#services/embedding/markdownChunker'
import { generateChecksum } from '#utils/checksum'

/**
 * Embed Chunk Job Handler
 *
 * Generates embedding for a single chunk and stores it in ChromaDB
 * Uses checksum to skip re-embedding unchanged content
 */
export async function embedChunkHandler(job) {
  const { summaryNoteId, chunkIndex, chunk, metadata } = job.data

  console.log(`🧠 Processing chunk ${chunkIndex + 1}/${totalChunks} for note ${summaryNoteId}`)

  // Generate checksum for the chunk content
  const contentChecksum = generateChecksum(chunk.content)
  const documentId = `${summaryNoteId}-${chunkIndex}`

  // Connect to vector DB (singleton with lazy initialization)
  const vectorDB = await getVectorDB()

  // Check if this chunk already exists
  const existingDoc = await vectorDB.getDocument('summary_notes', documentId)

  if (existingDoc && existingDoc.metadata?.checksum === contentChecksum) {
    console.log(`⏭️  Chunk ${chunkIndex + 1}/${totalChunks} unchanged, skipping (checksum: ${contentChecksum.substring(0, 8)})`)
    return
  }

  // Content changed or doesn't exist, proceed with embedding
  if (existingDoc) {
    console.log(`🔄 Chunk ${chunkIndex + 1}/${totalChunks} changed, re-embedding (old: ${existingDoc.metadata?.checksum?.substring(0, 8)}, new: ${contentChecksum.substring(0, 8)})`)
  } else {
    console.log(`✨ New chunk ${chunkIndex + 1}/${totalChunks}, embedding...`)
  }

  // Create embedding text with context
  const embeddingText = MarkdownChunker.createEmbeddingText(chunk)

  // Generate embedding
  const embedding = await embeddingService.generateEmbedding(embeddingText)

  // Prepare document with checksum in metadata
  const document = {
    id: documentId,
    embedding: embedding,
    content: chunk.content,
    metadata: {
      note_id: summaryNoteId,
      chunk_index: chunkIndex,
      title: metadata.title,
      section_heading: chunk.heading,
      heading_level: chunk.level,
      parent_heading: chunk.parent,
      description: metadata.description,
      created_at: metadata.created_at,
      checksum: contentChecksum,
      type: 'summary_note_chunk'
    }
  }

  // Store or update in ChromaDB
  await vectorDB.addDocuments('summary_notes', [document])

  console.log(`✓ Chunk ${chunkIndex + 1}/${totalChunks} embedded for note ${summaryNoteId}`)
}
