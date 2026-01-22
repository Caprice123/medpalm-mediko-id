import { ChromaClient } from 'chromadb'
import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

/**
 * Query ChromaDB
 *
 * This script queries documents from ChromaDB using semantic search
 * Run this AFTER adding data with addDataToChromaDB.js
 *
 * Prerequisites:
 * - ChromaDB running: npm run chromadb:start
 * - Data added: node scripts/addDataToChromaDB.js
 * - GEMINI_API_KEY in .env file
 */

async function generateEmbedding(text) {
  const model = genAI.getGenerativeModel({ model: 'text-embedding-004' })
  const result = await model.embedContent(text)
  return result.embedding.values
}

async function main() {
  console.log('🔍 Querying ChromaDB...\n')

  // Check for API key
  if (!process.env.GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY not found in .env file')
    process.exit(1)
  }

  // Connect to ChromaDB
  const client = new ChromaClient({
    path: 'http://localhost:8000'
  })

  try {
    await client.heartbeat()
    console.log('✅ Connected to ChromaDB at http://localhost:8000\n')
  } catch (error) {
    console.error('❌ Failed to connect to ChromaDB. Make sure it\'s running:')
    console.error('   npm run chromadb:start')
    process.exit(1)
  }

  // Get collection
  const collectionName = 'medical_test_collection'
  let collection

  try {
    collection = await client.getCollection({ name: collectionName })
    const count = await collection.count()
    console.log(`📦 Collection: ${collectionName}`)
    console.log(`   Documents: ${count}\n`)

    if (count === 0) {
      console.log('⚠️  Collection is empty! Please run: node scripts/addDataToChromaDB.js\n')
      process.exit(0)
    }
  } catch (error) {
    console.error(`❌ Collection "${collectionName}" not found!`)
    console.error('   Please run first: node scripts/addDataToChromaDB.js\n')
    process.exit(1)
  }

  // Query 1: General semantic search
  const queryText1 = 'What is a heart condition with chest pain?'
  console.log(`🔍 Query 1: "${queryText1}"`)
  console.log('🧠 Generating query embedding...')

  const queryEmbedding1 = await generateEmbedding(queryText1)

  const results1 = await collection.query({
    queryEmbeddings: [queryEmbedding1],
    nResults: 3
  })

  console.log('\n🎯 Top 3 most relevant results:')
  console.log('─'.repeat(80))

  if (results1.ids[0].length === 0) {
    console.log('No results found')
  } else {
    for (let i = 0; i < results1.ids[0].length; i++) {
      const similarity = (1 - results1.distances[0][i]).toFixed(4)
      console.log(`\n${i + 1}. Document ID: ${results1.ids[0][i]}`)
      console.log(`   📊 Similarity Score: ${similarity} (${(similarity * 100).toFixed(1)}% match)`)
      console.log(`   🏷️  Topic: ${results1.metadatas[0][i].topic}`)
      console.log(`   📖 Subject: ${results1.metadatas[0][i].subject}`)
      console.log(`   📄 Content: ${results1.documents[0][i].substring(0, 120)}...`)
    }
  }

  console.log('\n' + '─'.repeat(80))

  // Query 2: With metadata filter
  const queryText2 = 'blood pressure problems'
  console.log(`\n🔍 Query 2: "${queryText2}" (filtered by topic: Cardiology)`)
  console.log('🧠 Generating query embedding...')

  const queryEmbedding2 = await generateEmbedding(queryText2)

  const results2 = await collection.query({
    queryEmbeddings: [queryEmbedding2],
    nResults: 2,
    where: { topic: 'Cardiology' }
  })

  console.log('\n🎯 Cardiology results:')
  console.log('─'.repeat(80))

  if (results2.ids[0].length === 0) {
    console.log('No cardiology results found')
  } else {
    for (let i = 0; i < results2.ids[0].length; i++) {
      const similarity = (1 - results2.distances[0][i]).toFixed(4)
      console.log(`\n${i + 1}. ${results2.metadatas[0][i].subject}`)
      console.log(`   📊 Similarity: ${similarity} (${(similarity * 100).toFixed(1)}% match)`)
      console.log(`   📄 ${results2.documents[0][i].substring(0, 150)}...`)
    }
  }

  console.log('\n' + '─'.repeat(80))

  // Query 3: Different topic
  const queryText3 = 'breathing difficulties and lung infection'
  console.log(`\n🔍 Query 3: "${queryText3}"`)
  console.log('🧠 Generating query embedding...')

  const queryEmbedding3 = await generateEmbedding(queryText3)

  const results3 = await collection.query({
    queryEmbeddings: [queryEmbedding3],
    nResults: 2
  })

  console.log('\n🎯 Top 2 results:')
  console.log('─'.repeat(80))

  if (results3.ids[0].length === 0) {
    console.log('No results found')
  } else {
    for (let i = 0; i < results3.ids[0].length; i++) {
      const similarity = (1 - results3.distances[0][i]).toFixed(4)
      console.log(`\n${i + 1}. ${results3.metadatas[0][i].subject}`)
      console.log(`   📊 Similarity: ${similarity}`)
      console.log(`   🏷️  Topic: ${results3.metadatas[0][i].topic}`)
      console.log(`   📄 ${results3.documents[0][i].substring(0, 150)}...`)
    }
  }

  console.log('\n' + '─'.repeat(80))
  console.log('\n✨ Query complete!')
  console.log('\n💡 Tips:')
  console.log('- Modify queries in the script to test different searches')
  console.log('- Check ChromaDB Admin UI at http://localhost:3001')
  console.log('- Similarity scores range from 0 (no match) to 1 (perfect match)\n')
}

main().catch(console.error)
