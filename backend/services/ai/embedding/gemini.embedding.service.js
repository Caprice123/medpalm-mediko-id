import { GoogleGenerativeAI } from '@google/generative-ai'
import { BaseEmbeddingService } from './base.embedding.service.js'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

/**
 * Gemini Embedding Service
 *
 * Handles embedding generation using Google's Gemini embedding models
 */
export class GeminiEmbeddingService extends BaseEmbeddingService {
  /**
   * Generate embedding for a single text using Gemini
   * @param {string} model - Model name (e.g., 'text-embedding-004')
   * @param {string} text - Text to embed
   * @returns {Promise<Array<number>>} - 768-dimensional embedding vector
   */
  static async generateEmbedding(model, text) {
    try {
      const geminiModel = genAI.getGenerativeModel({ model })

      const result = await geminiModel.embedContent(text)
      const embedding = result.embedding

      return embedding.values
    } catch (error) {
      console.error('Error generating Gemini embedding:', error)
      throw new Error('Failed to generate embedding: ' + error.message)
    }
  }

  /**
   * Generate embeddings for multiple texts in batch
   * @param {string} model - Model name (e.g., 'text-embedding-004')
   * @param {Array<string>} texts - Array of texts to embed
   * @returns {Promise<Array<Array<number>>>} - Array of embedding vectors
   */
  static async generateEmbeddings(model, texts) {
    try {
      const geminiModel = genAI.getGenerativeModel({ model })

      const embeddingRequests = texts.map(text =>
        geminiModel.embedContent(text)
      )

      const results = await Promise.all(embeddingRequests)

      return results.map(result => result.embedding.values)
    } catch (error) {
      console.error('Error generating Gemini embeddings:', error)
      throw new Error('Failed to generate embeddings: ' + error.message)
    }
  }
}
