import { ChromaClient } from 'chromadb'
import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

/**
 * Add Sample Data to ChromaDB
 *
 * This script adds medical education documents to ChromaDB
 * Run this ONCE to populate the database
 *
 * Prerequisites:
 * - ChromaDB running: npm run chromadb:start
 * - GEMINI_API_KEY in .env file
 */

async function generateEmbedding(text) {
  const model = genAI.getGenerativeModel({ model: 'text-embedding-004' })
  const result = await model.embedContent(text)
  return result.embedding.values
}

async function main() {
  console.log('📝 Adding Sample Data to ChromaDB...\n')

  // Check for API key
  if (!process.env.GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY not found in .env file')
    process.exit(1)
  }

  // Connect to ChromaDB
  const client = new ChromaClient({
    path: 'http://194.233.71.166:8001'
  })

  try {
    await client.heartbeat()
    console.log('✅ Connected to ChromaDB at http://localhost:8000\n')
  } catch (error) {
    console.error('❌ Failed to connect to ChromaDB. Make sure it\'s running:')
    console.error('   npm run chromadb:start')
    process.exit(1)
  }

  // Get or create collection
  const collectionName = 'medical_test_collection'
  let collection

  try {
    collection = await client.getCollection({ name: collectionName })
    console.log(`📦 Found existing collection: ${collectionName}`)

    const count = await collection.count()
    if (count > 0) {
      console.log(`⚠️  Collection already has ${count} documents`)
      console.log('Do you want to delete and re-add? (This script will exit. Delete manually if needed)\n')
      process.exit(0)
    }
  } catch (error) {
    console.log(`📦 Creating new collection: ${collectionName}`)
    collection = await client.createCollection({
      name: collectionName,
      metadata: { description: 'Test collection for medical education content' }
    })
    console.log('✅ Collection created\n')
  }

  // Sample documents
  console.log('📄 Preparing 5 medical documents...')

  const documents = [
    'Diabetes mellitus is a chronic metabolic disorder characterized by elevated blood glucose levels. Type 1 diabetes results from autoimmune destruction of pancreatic beta cells.',
    'Hypertension, or high blood pressure, is a major risk factor for cardiovascular disease. It is defined as systolic BP ≥140 mmHg or diastolic BP ≥90 mmHg.',
    'Asthma is a chronic inflammatory disease of the airways characterized by reversible airflow obstruction, bronchial hyperresponsiveness, and airway inflammation.',
    'Pneumonia is an infection of the lung parenchyma caused by bacteria, viruses, or fungi. Common symptoms include fever, cough, and difficulty breathing.',
    'Acute myocardial infarction (heart attack) occurs when blood flow to the heart muscle is blocked, usually by a blood clot in a coronary artery.'
  ]

  const metadatas = [
    { topic: 'Endocrinology', difficulty: 'intermediate', subject: 'Diabetes' },
    { topic: 'Cardiology', difficulty: 'basic', subject: 'Hypertension' },
    { topic: 'Pulmonology', difficulty: 'intermediate', subject: 'Asthma' },
    { topic: 'Infectious Disease', difficulty: 'basic', subject: 'Pneumonia' },
    { topic: 'Cardiology', difficulty: 'advanced', subject: 'Myocardial Infarction' }
  ]

  // Generate embeddings
  console.log('🧠 Generating embeddings with Gemini (this may take a moment)...')

  const embeddings = await Promise.all(
    documents.map(doc => generateEmbedding(doc))
  )

  console.log('✅ Embeddings generated (768 dimensions each)\n')

  // Add to ChromaDB
  console.log('💾 Adding documents to ChromaDB...')

  await collection.add({
    ids: ['doc1', 'doc2', 'doc3', 'doc4', 'doc5'],
    documents: documents,
    metadatas: metadatas,
    embeddings: embeddings
  })

  const finalCount = await collection.count()
  console.log(`✅ Successfully added ${finalCount} documents!\n`)

  // Summary
  console.log('📊 Summary:')
  console.log(`   Collection: ${collectionName}`)
  console.log(`   Total documents: ${finalCount}`)
  console.log(`   Embedding model: Gemini text-embedding-004`)
  console.log(`   Embedding dimensions: 768\n`)

  console.log('✨ Next steps:')
  console.log('1. Open ChromaDB Admin UI at http://localhost:3001')
  console.log('2. Connect to: http://localhost:8000')
  console.log(`3. Browse collection: "${collectionName}"`)
  console.log('4. Run query script: node scripts/queryChromaDB.js\n')
}

main().catch(console.error)
