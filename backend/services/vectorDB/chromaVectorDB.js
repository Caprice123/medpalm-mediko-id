import { ChromaClient } from 'chromadb'
import { BaseVectorDB } from '#services/vectorDB/baseVectorDB'

/**
 * ChromaDB Client-Server Implementation
 *
 * Connects to local ChromaDB server via HTTP.
 * ChromaDB server runs locally with persistent storage (like PostgreSQL).
 * Data is stored in ./data/chromadb directory.
 *
 * To start the server: npm run chromadb:start
 */
export class ChromaVectorDB extends BaseVectorDB {
  constructor(config = {}) {
    super()
    this.host = config.host || process.env.CHROMA_HOST || 'localhost'
    this.port = config.port || process.env.CHROMA_PORT || 8000
    this.client = null
  }

  async initialize() {
    try {
      // Connect to ChromaDB server via HTTP (using newer API)
      this.client = new ChromaClient({
        host: this.host,
        port: this.port
      })

      // Test connection
      await this.client.heartbeat()
      console.log(`✓ ChromaDB connected at ${this.host}:${this.port}`)
    } catch (error) {
      console.error('Failed to connect to ChromaDB server:', error)
      console.error(`Attempted connection to: ${this.host}:${this.port}`)
      throw error
    }
  }

  async createCollection(collectionName, config = {}) {
    try {
      const collection = await this.client.createCollection({
        name: collectionName,
        metadata: {
          dimension: config.dimension || 768,
          distance: config.distance || 'cosine'
        }
      })
      console.log(`✓ ChromaDB collection created: ${collectionName}`)
      return collection
    } catch (error) {
      // Collection might already exist
      if (error.message?.includes('already exists')) {
        return await this.client.getCollection({ name: collectionName })
      }
      throw error
    }
  }

  async collectionExists(collectionName) {
    try {
      const prefixedName = this.getCollectionName(collectionName)
      await this.client.getCollection({ name: prefixedName })
      return true
    } catch (error) {
      return false
    }
  }

  async addDocuments(collectionName, documents) {
      console.log("COLLECTION: ", collectionName)
    try {
      // Try to get the collection, create if it doesn't exist
      let collection
      try {
        collection = await this.client.getCollection({ name: collectionName })
      } catch (error) {
        // Collection doesn't exist, create it
        if (error.message?.includes('does not exist') || error.name === 'ChromaNotFoundError') {
          console.log(`⚠️  Collection ${collectionName} not found, creating...`)
          collection = await this.createCollection(collectionName, {
            dimension: 768,
            distance: 'cosine'
          })
        } else {
          throw error
        }
      }
      console.log(collection)

      const ids = documents.map(doc => String(doc.id))
      const embeddings = documents.map(doc => doc.embedding)
      const metadatas = documents.map(doc => doc.metadata || {})
      const contents = documents.map(doc => doc.content || '')

      // Use upsert to add new or update existing documents
      await collection.upsert({
        ids,
        embeddings,
        metadatas,
        documents: contents
      })

      console.log(`✓ Upserted ${documents.length} documents to ${collectionName}`)
    } catch (error) {
      console.error('Failed to add documents to ChromaDB:', error)
      throw error
    }
  }

  async updateDocument(collectionName, documentId, embedding, metadata, content) {
    try {
      // Try to get the collection, create if it doesn't exist
      let collection
      try {
        collection = await this.client.getCollection({ name: collectionName })
      } catch (error) {
        // Collection doesn't exist, create it
        if (error.message?.includes('does not exist') || error.name === 'ChromaNotFoundError') {
          console.log(`⚠️  Collection ${collectionName} not found, creating...`)
          collection = await this.createCollection(collectionName, {
            dimension: 768,
            distance: 'cosine'
          })
        } else {
          throw error
        }
      }

      await collection.update({
        ids: [String(documentId)],
        embeddings: [embedding],
        metadatas: [metadata],
        documents: [content]
      })

      console.log(`✓ Updated document ${documentId} in ${collectionName}`)
    } catch (error) {
      console.error('Failed to update document in ChromaDB:', error)
      throw error
    }
  }

  async deleteDocument(collectionName, documentId) {
    try {
      const collection = await this.client.getCollection({ name: collectionName })

      await collection.delete({
        ids: [String(documentId)]
      })

      console.log(`✓ Deleted document ${documentId} from ${collectionName}`)
    } catch (error) {
      console.error('Failed to delete document from ChromaDB:', error)
      throw error
    }
  }

  /**
   * Delete documents by metadata filter
   * @param {string} collectionName - Collection name
   * @param {Object} whereFilter - ChromaDB where filter
   */
  async deleteDocumentsByMetadata(collectionName, whereFilter) {
    try {
      const collection = await this.client.getCollection({ name: collectionName })

      await collection.delete({
        where: whereFilter
      })

      console.log(`✓ Deleted documents from ${collectionName} matching filter:`, whereFilter)
    } catch (error) {
      console.error('Failed to delete documents from ChromaDB:', error)
      throw error
    }
  }

  /**
   * Get all documents from a collection
   * @param {string} collectionName - Collection name
   * @returns {Array} All documents in the collection
   */
  async getAllDocuments(collectionName) {
    try {
      const collection = await this.client.getCollection({ name: collectionName })

      const result = await collection.get()

      if (!result.ids || result.ids.length === 0) {
        return []
      }

      // Format documents
      const documents = []
      for (let i = 0; i < result.ids.length; i++) {
        documents.push({
          id: result.ids[i],
          metadata: result.metadatas[i],
          content: result.documents[i],
          embedding: result.embeddings?.[i] || null
        })
      }

      return documents
    } catch (error) {
      console.error('Failed to get all documents from ChromaDB:', error)
      return []
    }
  }

  /**
   * Get documents by metadata filter
   * @param {string} collectionName - Collection name
   * @param {Object} whereFilter - ChromaDB where filter (e.g., { note_id: 123 })
   * @returns {Array} Documents matching the filter
   */
  async getDocumentsByMetadata(collectionName, whereFilter) {
    try {
      const collection = await this.client.getCollection({ name: collectionName })

      const result = await collection.get({
        where: whereFilter
      })

      if (!result.ids || result.ids.length === 0) {
        return []
      }

      // Format documents
      const documents = []
      for (let i = 0; i < result.ids.length; i++) {
        documents.push({
          id: result.ids[i],
          metadata: result.metadatas[i],
          content: result.documents[i],
          embedding: result.embeddings?.[i] || null
        })
      }

      return documents
    } catch (error) {
      console.error('Failed to get documents by metadata from ChromaDB:', error)
      return []
    }
  }

  async search(collectionName, queryEmbedding, options = {}) {
    try {
      // Try to get the collection
      let collection
      try {
        collection = await this.client.getCollection({ name: collectionName })
      } catch (error) {
        // Collection doesn't exist, return empty results
        if (error.message?.includes('does not exist') || error.name === 'ChromaNotFoundError') {
          console.log(`⚠️  Collection ${collectionName} not found, returning empty results`)
          return []
        }
        throw error
      }

      const limit = options.limit || 5
      const filter = options.filter || null

      const results = await collection.query({
        queryEmbeddings: [queryEmbedding],
        nResults: limit,
        where: filter // ChromaDB filter format
      })

      // Transform results to standard format
      const formattedResults = []
      if (results.ids && results.ids[0]) {
        for (let i = 0; i < results.ids[0].length; i++) {
          const distance = results.distances[0][i]
          const similarityScore = 1 - distance // Convert distance to similarity (0-1, higher = more similar)

          // Apply threshold filter if specified (filter out low similarity scores)
          if (options.threshold && similarityScore < options.threshold) {
            continue
          }

          formattedResults.push({
            id: results.ids[0][i],
            score: similarityScore,
            metadata: results.metadatas[0][i],
            content: results.documents[0][i]
          })
        }
      }

      return formattedResults
    } catch (error) {
      console.error('Failed to search in ChromaDB:', error)
      throw error
    }
  }

  async getDocument(collectionName, documentId) {
    try {
      // Try to get the collection
      let collection
      try {
        console.log("PREFIX", collectionName)
        collection = await this.client.getCollection({ name: collectionName })
      } catch (error) {
        // Collection doesn't exist, return null
        if (error.message?.includes('does not exist') || error.name === 'ChromaNotFoundError') {
          return null
        }
        throw error
      }

      const result = await collection.get({
        ids: [String(documentId)]
      })

      if (!result.ids || result.ids.length === 0) {
        return null
      }

      return {
        id: result.ids[0],
        metadata: result.metadatas[0],
        content: result.documents[0]
      }
    } catch (error) {
      console.error('Failed to get document from ChromaDB:', error)
      return null
    }
  }

  async countDocuments(collectionName) {
    try {
      const prefixedName = this.getCollectionName(collectionName)
      const collection = await this.client.getCollection({ name: prefixedName })
      const count = await collection.count()
      return count
    } catch (error) {
      console.error('Failed to count documents in ChromaDB:', error)
      return 0
    }
  }

  async deleteCollection(collectionName) {
    try {
      const prefixedName = this.getCollectionName(collectionName)
      await this.client.deleteCollection({ name: prefixedName })
      console.log(`✓ Deleted collection: ${prefixedName}`)
    } catch (error) {
      console.error('Failed to delete collection from ChromaDB:', error)
      throw error
    }
  }

  async close() {
    // ChromaDB client doesn't need explicit closing
    console.log('✓ ChromaDB connection closed')
  }
}
