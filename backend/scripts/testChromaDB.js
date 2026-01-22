import { ChromaClient } from 'chromadb'
import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

/**
 * Simple ChromaDB Test Script
 *
 * This script demonstrates:
 * 1. Connecting to ChromaDB
 * 2. Creating a collection
 * 3. Adding documents with embeddings (generated via Gemini)
 * 4. Querying similar documents
 *
 * Prerequisites:
 * - ChromaDB running: npm run chromadb:start
 * - GEMINI_API_KEY in .env file
 *
 * Run this: node scripts/testChromaDB.js
 */

/**
 * Generate embedding using Gemini
 */
async function generateEmbedding(text) {
  const model = genAI.getGenerativeModel({ model: 'text-embedding-004' })
  const result = await model.embedContent(text)
  return result.embedding.values
}

async function main() {
  console.log('🚀 Starting ChromaDB Test...\n')

  // Check for API key
  if (!process.env.GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY not found in .env file')
    process.exit(1)
  }

  // 1. Connect to ChromaDB server
  const client = new ChromaClient({
    path: 'http://localhost:8000'
  })

  try {
    // Test connection
    await client.heartbeat()
    console.log('✅ Connected to ChromaDB at http://localhost:8000\n')
  } catch (error) {
    console.error('❌ Failed to connect to ChromaDB. Make sure it\'s running:')
    console.error('   npm run chromadb:start')
    process.exit(1)
  }

  // 2. Get or create collection
  const collectionName = 'medical_test_collection'

  let collection
  let needsData = false

  try {
    collection = await client.getCollection({ name: collectionName })
    console.log(`📦 Found existing collection: ${collectionName}`)

    const count = await collection.count()
    if (count === 0) {
      needsData = true
      console.log('   Collection is empty, will add data\n')
    } else {
      console.log(`   Collection has ${count} documents\n`)
    }
  } catch (error) {
    console.log(`📦 Collection doesn't exist, creating: ${collectionName}`)
    collection = await client.createCollection({
      name: collectionName,
      metadata: { description: 'Test collection for medical education content' }
    })
    console.log('✅ Collection created\n')
    needsData = true
  }

  // 3. Add sample documents if needed
  if (needsData) {
    console.log('📝 Preparing sample documents...')

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

    console.log('🧠 Generating embeddings with Gemini (this may take a moment)...')

    // Generate embeddings for all documents
    const embeddings = await Promise.all(
      documents.map(doc => generateEmbedding(doc))
    )

    console.log('✅ Embeddings generated\n')
    console.log('💾 Adding documents to ChromaDB...')

    // Add documents with embeddings
    await collection.add({
      ids: ['doc1', 'doc2', 'doc3', 'doc4', 'doc5'],
      documents: documents,
      metadatas: metadatas,
      embeddings: embeddings
    })

    console.log('✅ Added 5 documents\n')
  }

  // 4. Get collection info
  const count = await collection.count()
  console.log(`📊 Collection now has ${count} documents\n`)

  // 5. Query for similar documents
  const queryText1 = 'What is a heart condition with chest pain?'
  console.log(`🔍 Querying: "${queryText1}"`)
  console.log('🧠 Generating query embedding...\n')

  const queryEmbedding1 = await generateEmbedding(queryText1)

  const results = await collection.query({
    queryEmbeddings: [queryEmbedding1],
    nResults: 3
  })

  console.log('🎯 Top 3 most relevant results:')
  console.log('─'.repeat(80))

  for (let i = 0; i < results.ids[0].length; i++) {
    console.log(`\n${i + 1}. Document ID: ${results.ids[0][i]}`)
    console.log(`   Similarity Score: ${(1 - results.distances[0][i]).toFixed(4)}`)
    console.log(`   Topic: ${results.metadatas[0][i].topic}`)
    console.log(`   Subject: ${results.metadatas[0][i].subject}`)
    console.log(`   Content: ${results.documents[0][i].substring(0, 100)}...`)
  }

  console.log('\n' + '─'.repeat(80))

  // 6. Query with metadata filter
  const queryText2 = 'blood pressure problems'
  console.log(`\n🔍 Querying cardiology topics only: "${queryText2}"`)
  console.log('🧠 Generating query embedding...\n')

  const queryEmbedding2 = await generateEmbedding(queryText2)

  const cardiologyResults = await collection.query({
    queryEmbeddings: [queryEmbedding2],
    nResults: 2,
    where: { topic: 'Cardiology' }
  })

  console.log('🎯 Cardiology results:')
  console.log('─'.repeat(80))

  for (let i = 0; i < cardiologyResults.ids[0].length; i++) {
    console.log(`\n${i + 1}. ${cardiologyResults.metadatas[0][i].subject}`)
    console.log(`   ${cardiologyResults.documents[0][i].substring(0, 120)}...`)
  }

  console.log('\n' + '─'.repeat(80))

  // 7. Final instructions
  console.log('\n✨ Success! Now you can:')
  console.log('1. Open ChromaDB Admin UI at http://localhost:3001')
  console.log('2. Connect to: http://localhost:8000')
  console.log(`3. Browse the collection: "${collectionName}"`)
  console.log('4. View all 5 documents and their embeddings')
  console.log('\n💡 Collection will persist until you delete it or restart ChromaDB\n')
}

main().catch(console.error)
