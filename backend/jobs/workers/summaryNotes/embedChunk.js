import { getVectorDB } from '#services/vectorDB/vectorDBFactory'
import embeddingService from '#services/embedding/embeddingService'
import MarkdownChunker from '#services/embedding/markdownChunker'
import { generateChecksum } from '#utils/checksum'
import { GetConstantsService } from '#services/constant/getConstantsService'
import { ValidationError } from '#errors/validationError'

/**
 * Embed Chunk Job Handler
 *
 * Generates embedding for a single chunk and stores it in ChromaDB
 * Uses checksum to skip re-embedding unchanged content
 */
export async function embedChunkHandler(job) {
  const { summaryNoteId, chunkIndex, chunk, metadata } = job.data

  if (!summaryNoteId || chunkIndex === undefined || !chunk || !metadata) {
    throw new ValidationError('Missing required job data: summaryNoteId, chunkIndex, chunk, or metadata')
  }

  if (!chunk.content) {
    throw new ValidationError('Chunk content is required')
  }

  console.log(`🧠 Processing chunk ${chunkIndex + 1} for note ${summaryNoteId}`)

  // Generate checksum for the chunk content
  const contentChecksum = generateChecksum(chunk.content)
  const documentId = `${summaryNoteId}-${chunkIndex}`

  // Get embedding model and build environment-aware collection name
  const constants = await GetConstantsService.call(['chatbot_validated_embedding_model'])
  const model = constants.chatbot_validated_embedding_model

  // Connect to vector DB (singleton with lazy initialization)
  const vectorDB = await getVectorDB()

  // Get environment-aware collection name (e.g., dev_text-embedding-004_summary_notes in development)
  const collectionName = vectorDB.getCollectionName('summary_notes', model)

  // Check if this chunk already exists
  const existingDoc = await vectorDB.getDocument(collectionName, documentId)

  if (existingDoc && existingDoc.metadata?.checksum === contentChecksum) {
    console.log(`⏭️  Chunk ${chunkIndex + 1} unchanged, skipping (checksum: ${contentChecksum.substring(0, 8)})`)
    return
  }

  // Content changed or doesn't exist, proceed with embedding
  if (existingDoc) {
    console.log(`🔄 Chunk ${chunkIndex + 1} changed, re-embedding (old: ${existingDoc.metadata?.checksum?.substring(0, 8)}, new: ${contentChecksum.substring(0, 8)})`)
  } else {
    console.log(`✨ New chunk ${chunkIndex + 1}, embedding...`)
  }

  // Create embedding text with context
  const embeddingText = MarkdownChunker.createEmbeddingText(chunk)

  // Generate embedding
  const embedding = await embeddingService.generateEmbedding(embeddingText, model)

  // Prepare document with checksum in metadata
  const document = {
    id: documentId,
    embedding: embedding,
    content: chunk.content,
    metadata: {
      note_id: summaryNoteId,
      note_unique_id: metadata.unique_id,
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
  console.log(document)

  // Store or update in ChromaDB using environment-aware collection name
  await vectorDB.addDocuments(collectionName, [document])

  console.log(`✓ Chunk ${chunkIndex + 1} embedded for note ${summaryNoteId} in collection: ${collectionName}`)
}
