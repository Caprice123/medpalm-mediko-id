import { BaseService } from "#services/baseService"

/**
 * Base Embedding Service
 *
 * Abstract class that defines the interface for embedding providers
 */
export class BaseEmbeddingService extends BaseService {
  /**
   * Generate embedding for a single text
   * @param {string} model - Model name
   * @param {string} text - Text to embed
   * @returns {Promise<Array<number>>} - Embedding vector
   */
  static async generateEmbedding(model, text) {
    throw new Error('generateEmbedding() must be implemented by subclass')
  }

  /**
   * Generate embeddings for multiple texts in batch
   * @param {string} model - Model name
   * @param {Array<string>} texts - Array of texts to embed
   * @returns {Promise<Array<Array<number>>>} - Array of embedding vectors
   */
  static async generateEmbeddings(model, texts) {
    throw new Error('generateEmbeddings() must be implemented by subclass')
  }
}
