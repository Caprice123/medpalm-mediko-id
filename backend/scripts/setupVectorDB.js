import dotenv from 'dotenv'
import { initializeVectorDB, closeVectorDB } from '#services/vectorDB/vectorDBFactory'

/**
 * Vector DB Setup Script
 *
 * One-time setup to initialize the vector database and create required collections.
 * Run this before starting workers or the main server.
 *
 * Usage:
 *   node scripts/setupVectorDB.js
 */

dotenv.config()

console.log('🚀 Setting up Vector DB...\n')

async function setup() {
  try {
    // Initialize vector DB and create collections
    console.log('📦 Initializing Vector DB and creating collections...')
    await initializeVectorDB()
    console.log('✓ Vector DB setup completed\n')

    console.log('✅ Setup successful!')
    console.log('You can now start the server and workers.\n')
  } catch (error) {
    console.error('❌ Setup failed:', error)
    process.exit(1)
  } finally {
    // Close connection
    await closeVectorDB()
  }
}

// Run setup
setup()
