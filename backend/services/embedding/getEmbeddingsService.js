import { getVectorDB } from '#services/vectorDB/vectorDBFactory'
import embeddingService from '#services/embedding/embeddingService'
import { GetConstantsService } from '#services/constant/getConstantsService'

export class GetEmbeddingsService {
  /**
   * Get all embeddings from ChromaDB summary_notes collection
   * @param {Object} params - Parameters
   * @param {number} params.page - Page number (1-indexed)
   * @param {number} params.perPage - Items per page
   * @returns {Promise<Object>} Embeddings data with pagination
   */
  static async call({ page = 1, perPage = 20 } = {}) {
    try {
      const vectorDB = await getVectorDB()

      // Get embedding model for environment-aware collection name
      const constants = await GetConstantsService.call(['chatbot_validated_embedding_model'])
      const model = constants.chatbot_validated_embedding_model
      const collectionName = vectorDB.getCollectionName('summary_notes', model)

      // Get total count
      const totalCount = await embeddingService.countSummaryNoteEmbeddings(model)

      // Get documents from ChromaDB using environment-aware collection name
      const documents = await vectorDB.getAllDocuments(collectionName)

      if (!documents || documents.length === 0) {
        return {
          data: [],
          pagination: {
            page: 1,
            perPage: perPage,
            totalCount: 0,
            totalPages: 0,
            isLastPage: true
          }
        }
      }

      // Apply pagination
      const startIndex = (page - 1) * perPage
      const endIndex = startIndex + perPage
      const paginatedDocs = documents.slice(startIndex, endIndex)

      // Format documents for response
      const formattedDocs = paginatedDocs.map((doc, index) => ({
        id: doc.id,
        noteId: doc.metadata?.note_id || doc.id,
        title: doc.metadata?.title || 'Untitled',
        sectionHeading: doc.metadata?.section_heading || null,
        parentHeading: doc.metadata?.parent_heading || null,
        headingLevel: doc.metadata?.heading_level || 0,
        chunkIndex: doc.metadata?.chunk_index,
        description: doc.metadata?.description || '',
        content: doc.content?.substring(0, 200) || '',
        contentLength: doc.content?.length || 0,
        embeddingDimension: doc.embedding?.length || 0,
        createdAt: doc.metadata?.created_at || null,
        type: doc.metadata?.type || 'summary_note_chunk'
      }))

      const totalPages = Math.ceil(totalCount / perPage)

      return {
        data: formattedDocs,
        pagination: {
          page: page,
          perPage: perPage,
          totalCount: totalCount,
          totalPages: totalPages,
          isLastPage: page >= totalPages
        }
      }
    } catch (error) {
      console.error('Error fetching embeddings:', error)
      throw new Error('Failed to fetch embeddings: ' + error.message)
    }
  }

  /**
   * Get a specific embedding document by ID
   * @param {string|number} documentId - Document ID
   * @returns {Promise<Object>} Document with full content
   */
  static async getById(documentId) {
    try {
      const vectorDB = await getVectorDB()

      // Get embedding model for environment-aware collection name
      const constants = await GetConstantsService.call(['chatbot_validated_embedding_model'])
      const model = constants.chatbot_validated_embedding_model
      const collectionName = vectorDB.getCollectionName('summary_notes', model)

      const document = await vectorDB.getDocument(collectionName, documentId)

      if (!document) {
        throw new Error('Document not found')
      }

      return {
        id: document.id,
        noteId: document.metadata?.note_id || document.id,
        title: document.metadata?.title || 'Untitled',
        sectionHeading: document.metadata?.section_heading || null,
        parentHeading: document.metadata?.parent_heading || null,
        headingLevel: document.metadata?.heading_level || 0,
        chunkIndex: document.metadata?.chunk_index,
        totalChunks: document.metadata?.total_chunks,
        description: document.metadata?.description || '',
        content: document.content,
        embedding: document.embedding,
        embeddingDimension: document.embedding?.length || 0,
        created_at: document.metadata?.created_at || null,
        type: document.metadata?.type || 'summary_note_chunk',
        metadata: document.metadata
      }
    } catch (error) {
      console.error('Error fetching embedding document:', error)
      throw new Error('Failed to fetch embedding document: ' + error.message)
    }
  }
}
