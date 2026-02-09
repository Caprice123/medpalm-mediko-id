import { getVectorDB } from '#services/vectorDB/vectorDBFactory'
import MarkdownChunker from '#services/embedding/markdownChunker'
import { blockNoteToMarkdown } from '#utils/blockNoteConverter'
import { GetConstantsService } from '#services/constant/getConstantsService'
import { RouterUtils } from '#utils/aiUtils/routerUtils'
import { ValidationError } from '#errors/validationError'

class EmbeddingService {
  /**
   * Get embedding model from constants or environment
   * @returns {Promise<string>} - Embedding model name
   */
  async getEmbeddingModel() {
    try {
      const constants = await GetConstantsService.call(['embedding_model'])
      return constants.embedding_model || process.env.EMBEDDING_MODEL || 'text-embedding-004'
    } catch (error) {
      console.warn('Failed to get embedding model from constants, using default')
      return process.env.EMBEDDING_MODEL || 'text-embedding-004'
    }
  }

  /**
   * Generate embedding for a text using configured embedding provider
   * @param {string} text - The text to embed
   * @returns {Promise<Array<number>>} Embedding vector (dimension depends on model)
   */
  async generateEmbedding(text, modelName) {
    try {
      const ProviderService = RouterUtils.getEmbeddingProvider(modelName)

      if (!ProviderService) {
        throw new Error(`No embedding provider found for model: ${modelName}`)
      }

      return await ProviderService.generateEmbedding(modelName, text)
    } catch (error) {
      console.error('Error generating embedding:', error)
      throw new Error('Failed to generate embedding: ' + error.message)
    }
  }

  /**
   * Generate embeddings for multiple texts in batch
   * @param {Array<string>} texts - Array of texts to embed
   * @returns {Promise<Array<Array<number>>>} Array of embedding vectors
   */
  async generateEmbeddings(texts) {
    try {
      const modelName = await this.getEmbeddingModel()
      const ProviderService = RouterUtils.getEmbeddingProvider(modelName)

      if (!ProviderService) {
        throw new Error(`No embedding provider found for model: ${modelName}`)
      }

      return await ProviderService.generateEmbeddings(modelName, texts)
    } catch (error) {
      console.error('Error generating embeddings:', error)
      throw new Error('Failed to generate embeddings: ' + error.message)
    }
  }

  /**
   * Embed a summary note and store in ChromaDB with heading-based chunking
   * @param {Object} summaryNote - Summary note object with id, title, content, markdown_content
   * @returns {Promise<void>}
   */
  async embedSummaryNote(summaryNote) {
    try {
      const vectorDB = await getVectorDB()

      // Get embedding model for environment-aware collection name
      const constants = await GetConstantsService.call(['chatbot_validated_embedding_model'])
      const model = constants.chatbot_validated_embedding_model
      const collectionName = vectorDB.getCollectionName('summary_notes', model)

      // First, delete any existing chunks for this note (to handle updates)
      await this.deleteSummaryNoteEmbedding(summaryNote.unique_id, model)

      // Convert BlockNote content to markdown
      const markdownContent = blockNoteToMarkdown(summaryNote.content)

      if (!markdownContent || markdownContent.trim() === '') {
        throw new ValidationError(`Failed to convert content to markdown for note ${summaryNote.id}`)
      }

      // Chunk the markdown content by headings
      const chunks = MarkdownChunker.chunkByHeadings(
        summaryNote.title,
        markdownContent
      )

      console.log(`📄 Chunking summary note ${summaryNote.unique_id}: "${summaryNote.title}" into ${chunks.length} chunks`)

      // Prepare texts for embedding (with context)
      const textsToEmbed = chunks.map(chunk =>
        MarkdownChunker.createEmbeddingText(chunk)
      )

      // Generate embeddings for all chunks in parallel
      const embeddings = await this.generateEmbeddings(textsToEmbed)

      // Prepare documents for ChromaDB
      const documents = chunks.map((chunk, index) => ({
        id: `${summaryNote.unique_id}-${index}`,  // Use UUID-based chunk ID
        embedding: embeddings[index],
        content: chunk.content,
        metadata: {
          note_id: summaryNote.id,  // Keep numeric ID for validated search
          note_unique_id: summaryNote.unique_id,  // Add unique_id for UUID-based operations
          chunk_index: index,
          total_chunks: chunks.length,
          title: summaryNote.title,
          section_heading: chunk.heading,
          heading_level: chunk.level,
          parent_heading: chunk.parent || '',
          description: summaryNote.description || '',
          created_at: summaryNote.created_at ? summaryNote.created_at.toISOString() : new Date().toISOString(),
          type: 'summary_note_chunk'
        }
      }))

      // Store all chunks in ChromaDB using environment-aware collection name
      await vectorDB.addDocuments(collectionName, documents)
      console.log(`✓ Created ${chunks.length} embeddings for summary note: ${summaryNote.unique_id} in collection: ${collectionName}`)
    } catch (error) {
      console.error('Error embedding summary note:', error)
      throw new Error('Failed to embed summary note: ' + error.message)
    }
  }

  /**
   * Embed multiple summary notes in batch
   * @param {Array<Object>} summaryNotes - Array of summary note objects
   * @returns {Promise<void>}
   */
  async embedSummaryNotes(summaryNotes) {
    try {
      const vectorDB = await getVectorDB()

      // Get embedding model for environment-aware collection name
      const constants = await GetConstantsService.call(['chatbot_validated_embedding_model'])
      const model = constants.chatbot_validated_embedding_model
      const collectionName = vectorDB.getCollectionName('summary_notes', model)

      // Convert BlockNote content to markdown for each note
      const markdownContents = summaryNotes.map(note => blockNoteToMarkdown(note.content))

      // Prepare texts for embedding
      const texts = summaryNotes.map((note, index) =>
        `${note.title}\n\n${markdownContents[index]}`
      )

      // Generate embeddings
      console.log(`Generating embeddings for ${summaryNotes.length} summary notes...`)
      const embeddings = await this.generateEmbeddings(texts)

      // Prepare documents
      const documents = summaryNotes.map((note, index) => ({
        id: note.id,
        embedding: embeddings[index],
        content: markdownContents[index],
        metadata: {
          title: note.title,
          description: note.description || '',
          note_id: note.id,
          created_at: note.created_at ? note.created_at.toISOString() : new Date().toISOString(),
          type: 'summary_note'
        }
      }))

      // Store in ChromaDB using environment-aware collection name
      await vectorDB.addDocuments(collectionName, documents)
      console.log(`✓ Created embeddings for ${summaryNotes.length} summary notes in collection: ${collectionName}`)
    } catch (error) {
      console.error('Error embedding summary notes:', error)
      throw new Error('Failed to embed summary notes: ' + error.message)
    }
  }

  /**
   * Delete all chunks for a summary note from ChromaDB
   * @param {string} summaryNoteUniqueId - Unique ID of the summary note to delete
   * @param {string} model - Embedding model name (optional)
   * @returns {Promise<void>}
   */
  async deleteSummaryNoteEmbedding(summaryNoteUniqueId, model = null) {
    try {
      const vectorDB = await getVectorDB()

      // Get embedding model if not provided
      if (!model) {
        const constants = await GetConstantsService.call(['chatbot_validated_embedding_model'])
        model = constants.chatbot_validated_embedding_model
      }

      const collectionName = vectorDB.getCollectionName('summary_notes', model)

      // Delete all chunks for this note using unique_id metadata filter
      await vectorDB.deleteDocumentsByMetadata(collectionName, {
        note_unique_id: summaryNoteUniqueId
      })

      console.log(`✓ Deleted all embeddings for summary note: ${summaryNoteUniqueId} from collection: ${collectionName}`)
    } catch (error) {
      console.error('Error deleting summary note embedding:', error)
      // Don't throw - allow silent failure for deletion
    }
  }

  /**
   * Count total embeddings in summary_notes collection
   * @param {string} model - Embedding model name (optional)
   * @returns {Promise<number>} Total count of embeddings
   */
  async countSummaryNoteEmbeddings(model = null) {
    try {
      const vectorDB = await getVectorDB()

      // Get embedding model if not provided
      if (!model) {
        const constants = await GetConstantsService.call(['chatbot_validated_embedding_model'])
        model = constants.chatbot_validated_embedding_model
      }

      const collectionName = vectorDB.getCollectionName('summary_notes', model)
      const count = await vectorDB.countDocuments(collectionName)
      return count
    } catch (error) {
      console.error('Error counting summary note embeddings:', error)
      return 0
    }
  }
}

export default new EmbeddingService()
