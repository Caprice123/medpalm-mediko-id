import { ChromaVectorDB } from '#services/vectorDB/chromaVectorDB'
import { QdrantVectorDB } from '#services/vectorDB/qdrantVectorDB'

/**
 * Vector Database Factory
 *
 * Automatically selects the appropriate vector DB based on environment.
 * Allows easy switching between ChromaDB and Qdrant without code changes.
 *
 * Environment Variables:
 * - VECTOR_DB: 'chroma' | 'qdrant' (default: 'chroma')
 * - CHROMA_PATH: Path for ChromaDB storage (default: './data/chromadb')
 * - QDRANT_HOST: Qdrant server host (default: 'localhost')
 * - QDRANT_PORT: Qdrant server port (default: 6333)
 */

let vectorDBInstance = null
let isInitialized = false

export function createVectorDB() {
  if (vectorDBInstance) {
    return vectorDBInstance
  }

  const dbType = process.env.VECTOR_DB || 'chroma'

  switch (dbType.toLowerCase()) {
    case 'qdrant':
      console.log('🔷 Using Qdrant Vector Database')
      vectorDBInstance = new QdrantVectorDB({
        host: process.env.QDRANT_HOST,
        port: process.env.QDRANT_PORT,
        apiKey: process.env.QDRANT_API_KEY
      })
      break

    case 'chroma':
    default:
      console.log('🟢 Using ChromaDB Vector Database (Client-Server Mode)')
      vectorDBInstance = new ChromaVectorDB({
        host: process.env.CHROMA_HOST,
        port: process.env.CHROMA_PORT
      })
      break
  }

  return vectorDBInstance
}

/**
 * Get the current vector DB instance (with lazy initialization)
 * Automatically connects on first use
 * @returns {Promise<BaseVectorDB>}
 */
export async function getVectorDB() {
  if (!vectorDBInstance) {
    createVectorDB()
  }

  // Lazy initialization: connect on first use
  if (!isInitialized) {
    await vectorDBInstance.initialize()
    isInitialized = true
  }

  return vectorDBInstance
}

/**
 * Initialize vector database and create collections (one-time setup)
 * Use this for setup scripts, not for workers
 */
export async function initializeVectorDB() {
  try {
    // Get instance (will auto-initialize connection via singleton)
    const vectorDB = await getVectorDB()

    // Create summary_notes collection if it doesn't exist
    const collectionName = 'summary_notes'
    const exists = await vectorDB.collectionExists(collectionName)

    if (!exists) {
      await vectorDB.createCollection(collectionName, {
        dimension: 768, // text-embedding-ada-002 dimension
        distance: 'cosine'
      })
      console.log(`✓ Created collection: ${collectionName}`)
    } else {
      console.log(`✓ Collection already exists: ${collectionName}`)
    }

    return vectorDB
  } catch (error) {
    console.error('Failed to initialize Vector DB:', error)
    throw error
  }
}

/**
 * Close vector database connection
 */
export async function closeVectorDB() {
  if (vectorDBInstance) {
    await vectorDBInstance.close()
    vectorDBInstance = null
  }
}
