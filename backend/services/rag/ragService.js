import { getVectorDB } from '#services/vectorDB/vectorDBFactory'
import embeddingService from '#services/embedding/embeddingService'

class RAGService {
  /**
   * Search for relevant summary notes using semantic search
   * @param {string} query - The search query
   * @param {Object} options - Search options
   * @param {number} options.limit - Maximum number of results (default: 5)
   * @param {number} options.threshold - Minimum similarity score (default: 0.5)
   * @returns {Promise<Array>} Array of relevant documents with scores
   */
  async searchSummaryNotes(query, options = {}) {
    try {
      const { limit = 5, threshold = 0.5 } = options

      // Generate embedding for the query
      const queryEmbedding = await EmbeddingService.generateEmbedding(query)

      // Search in ChromaDB
      const vectorDB = await getVectorDB()
      const results = await vectorDB.search('summary_notes', queryEmbedding, {
        limit,
        threshold
      })

      // Transform results
      return results.map(result => ({
        id: result.id,
        title: result.metadata.title,
        description: result.metadata.description,
        content: result.content,
        score: result.score,
        noteId: result.metadata.note_id,
        created_at: result.metadata.created_at
      }))
    } catch (error) {
      console.error('Error searching summary notes:', error)
      throw new Error('Failed to search summary notes: ' + error.message)
    }
  }

  /**
   * Get relevant context from summary notes for RAG
   * Formats the search results into a context string for AI prompts
   * @param {string} query - The search query
   * @param {Object} options - Search options
   * @returns {Promise<Object>} Context object with formatted text and sources
   */
  async getRelevantContext(query, options = {}) {
    try {
      const results = await this.searchSummaryNotes(query, options)

      if (results.length === 0) {
        return {
          context: 'Tidak ada informasi relevan yang ditemukan dari catatan ringkasan.',
          sources: [],
          hasContext: false
        }
      }

      // Format context as structured text
      const contextParts = results.map((result, index) => {
        return `[Sumber ${index + 1}: ${result.title}]\n${result.content}\n`
      })

      const context = contextParts.join('\n---\n\n')

      // Prepare sources for citation
      const sources = results.map(result => ({
        sourceType: 'summary_note',
        title: result.title,
        content: result.content.substring(0, 500), // First 500 chars for preview
        url: null, // No URL for internal summary notes
        score: result.score,
        noteId: result.noteId
      }))

      return {
        context,
        sources,
        hasContext: true
      }
    } catch (error) {
      console.error('Error getting relevant context:', error)
      throw new Error('Failed to get relevant context: ' + error.message)
    }
  }

  /**
   * Hybrid search: Combine semantic search with keyword filtering
   * @param {string} query - The search query
   * @param {Object} filters - Additional filters
   * @param {Array<number>} filters.tagIds - Filter by tag IDs
   * @param {string} filters.searchTerm - Additional keyword search
   * @param {Object} options - Search options
   * @returns {Promise<Array>} Array of relevant documents
   */
  async hybridSearch(query, filters = {}, options = {}) {
    try {
      const { limit = 5, threshold = 0.5 } = options
      const { tagIds, searchTerm } = filters

      // Generate embedding for the query
      const queryEmbedding = await EmbeddingService.generateEmbedding(query)

      // Build ChromaDB filter
      let where = null
      if (tagIds && tagIds.length > 0) {
        // Note: This assumes we store tag_ids in metadata
        // You may need to adjust based on your metadata structure
        where = {
          tag_ids: { $in: tagIds }
        }
      }

      // Search in ChromaDB with filters
      const vectorDB = await getVectorDB()
      const results = await vectorDB.search('summary_notes', queryEmbedding, {
        limit,
        threshold,
        filter: where
      })

      // Additional keyword filtering if needed
      let filteredResults = results
      if (searchTerm) {
        filteredResults = results.filter(result =>
          result.metadata.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          result.content.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }

      // Transform results
      return filteredResults.map(result => ({
        id: result.id,
        title: result.metadata.title,
        description: result.metadata.description,
        content: result.content,
        score: result.score,
        noteId: result.metadata.note_id,
        created_at: result.metadata.created_at
      }))
    } catch (error) {
      console.error('Error performing hybrid search:', error)
      throw new Error('Failed to perform hybrid search: ' + error.message)
    }
  }

  /**
   * Re-rank search results based on relevance to query
   * Uses a simple scoring algorithm combining semantic similarity and keyword matching
   * @param {Array} results - Search results from vector DB
   * @param {string} query - Original query
   * @returns {Array} Re-ranked results
   */
  rerankResults(results, query) {
    const queryTerms = query.toLowerCase().split(/\s+/)

    return results.map(result => {
      let rerankScore = result.score

      // Boost if query terms appear in title
      const titleLower = result.title.toLowerCase()
      const titleMatches = queryTerms.filter(term => titleLower.includes(term)).length
      rerankScore += titleMatches * 0.1

      // Boost if query terms appear in content
      const contentLower = result.content.toLowerCase()
      const contentMatches = queryTerms.filter(term => contentLower.includes(term)).length
      rerankScore += contentMatches * 0.05

      return {
        ...result,
        rerankScore
      }
    }).sort((a, b) => b.rerankScore - a.rerankScore)
  }
}

export default new RAGService()
