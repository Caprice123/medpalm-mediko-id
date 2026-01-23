/**
 * Base Vector Database Interface
 *
 * This abstraction allows easy switching between ChromaDB and Qdrant
 * without changing application code.
 */

export class BaseVectorDB {
  /**
   * Get collection name with environment and model prefix
   * @param {string} collectionName - Base collection name
   * @param {string} embeddingModel - Embedding model name (optional)
   * @returns {string} - Prefixed collection name
   */
  getCollectionName(collectionName, embeddingModel = null) {
    const env = process.env.NODE_ENV || 'development'
    const model = embeddingModel || process.env.EMBEDDING_MODEL || 'text-embedding-004'

    // Replace invalid characters with underscores for ChromaDB compatibility
    // ChromaDB only allows [a-zA-Z0-9._-]
    const sanitizedModel = model.replace(/[^a-zA-Z0-9._-]/g, '_')
    const sanitizedCollection = collectionName.replace(/[^a-zA-Z0-9._-]/g, '_')

    if (env === 'development') {
      return `dev_${sanitizedModel}_${sanitizedCollection}`
    }
    return `${sanitizedModel}_${sanitizedCollection}`
  }

  /**
   * Initialize the vector database connection
   */
  async initialize() {
    throw new Error('initialize() must be implemented by subclass')
  }

  /**
   * Create a collection for storing embeddings
   * @param {string} collectionName - Name of the collection
   * @param {Object} config - Collection configuration
   * @param {number} config.dimension - Vector dimension size (e.g., 768, 1536)
   * @param {string} config.distance - Distance metric ('cosine', 'euclidean', 'dot')
   */
  async createCollection(collectionName, config) {
    throw new Error('createCollection() must be implemented by subclass')
  }

  /**
   * Check if collection exists
   * @param {string} collectionName
   * @returns {Promise<boolean>}
   */
  async collectionExists(collectionName) {
    throw new Error('collectionExists() must be implemented by subclass')
  }

  /**
   * Add documents with embeddings to collection
   * @param {string} collectionName
   * @param {Array<Object>} documents
   * @param {string} documents[].id - Unique document ID
   * @param {Array<number>} documents[].embedding - Vector embedding
   * @param {Object} documents[].metadata - Document metadata
   * @param {string} documents[].content - Original text content
   */
  async addDocuments(collectionName, documents) {
    throw new Error('addDocuments() must be implemented by subclass')
  }

  /**
   * Update document embedding and metadata
   * @param {string} collectionName
   * @param {string} documentId
   * @param {Array<number>} embedding
   * @param {Object} metadata
   * @param {string} content
   */
  async updateDocument(collectionName, documentId, embedding, metadata, content) {
    throw new Error('updateDocument() must be implemented by subclass')
  }

  /**
   * Delete document from collection
   * @param {string} collectionName
   * @param {string} documentId
   */
  async deleteDocument(collectionName, documentId) {
    throw new Error('deleteDocument() must be implemented by subclass')
  }

  /**
   * Semantic search using vector similarity
   * @param {string} collectionName
   * @param {Array<number>} queryEmbedding - Query vector
   * @param {Object} options - Search options
   * @param {number} options.limit - Number of results to return
   * @param {Object} options.filter - Metadata filters
   * @param {number} options.threshold - Minimum similarity score (0-1)
   * @returns {Promise<Array<Object>>} Search results with scores
   */
  async search(collectionName, queryEmbedding, options = {}) {
    throw new Error('search() must be implemented by subclass')
  }

  /**
   * Get document by ID
   * @param {string} collectionName
   * @param {string} documentId
   * @returns {Promise<Object|null>}
   */
  async getDocument(collectionName, documentId) {
    throw new Error('getDocument() must be implemented by subclass')
  }

  /**
   * Count documents in collection
   * @param {string} collectionName
   * @returns {Promise<number>}
   */
  async countDocuments(collectionName) {
    throw new Error('countDocuments() must be implemented by subclass')
  }

  /**
   * Delete entire collection
   * @param {string} collectionName
   */
  async deleteCollection(collectionName) {
    throw new Error('deleteCollection() must be implemented by subclass')
  }

  /**
   * Close database connection
   */
  async close() {
    throw new Error('close() must be implemented by subclass')
  }
}
