import dotenv from 'dotenv'
import { createSummaryNotesWorker, shutdownWorker as shutdownSummaryNotesWorker } from '#jobs/workers/summaryNotesWorker'

/**
 * Background Worker Process
 *
 * Processes jobs from specific queues
 * Run this separately from the main server: node worker.js [queueName]
 *
 * Examples:
 *   node worker.js summaryNotes
 *   node worker.js              (defaults to summaryNotes)
 *
 * Note: Make sure to run the setup script first to initialize the vector DB:
 *   node scripts/setupVectorDB.js
 */

dotenv.config()

// Get queue name from command-line argument
const queueName = process.argv[2] || 'summaryNotes'

// Available workers registry
const workerRegistry = {
  summaryNotes: {
    name: 'Summary Notes',
    create: createSummaryNotesWorker,
    shutdown: shutdownSummaryNotesWorker
  }
  // Add more workers here as needed:
  // otherQueue: {
  //   name: 'Other Queue',
  //   create: createOtherQueueWorker,
  //   shutdown: shutdownOtherQueueWorker
  // }
}

console.log('🚀 Starting background worker...\n')

let worker
let workerConfig

async function start() {
  try {
    // Validate queue name
    workerConfig = workerRegistry[queueName]
    if (!workerConfig) {
      console.error(`❌ Unknown queue: "${queueName}"`)
      console.error('\nAvailable queues:')
      Object.keys(workerRegistry).forEach(name => {
        console.error(`  - ${name} (${workerRegistry[name].name})`)
      })
      console.error('\nUsage: node worker.js [queueName]')
      process.exit(1)
    }

    console.log(`📋 Queue: ${workerConfig.name} (${queueName})\n`)

    // Create and start the worker
    worker = workerConfig.create()

    console.log(`\n✅ ${workerConfig.name} worker is running`)
    console.log('📊 Monitor jobs at: http://localhost:' + (process.env.PORT || 5000) + '/admin/queues')
    console.log('Press Ctrl+C to stop\n')
  } catch (error) {
    console.error('❌ Failed to start worker:', error)
    process.exit(1)
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  if (workerConfig && worker) {
    await workerConfig.shutdown(worker)
  }
  process.exit(0)
})

process.on('SIGINT', async () => {
  if (workerConfig && worker) {
    await workerConfig.shutdown(worker)
  }
  process.exit(0)
})

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error)
  if (workerConfig && worker) {
    workerConfig.shutdown(worker).then(() => process.exit(1))
  } else {
    process.exit(1)
  }
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection at:', promise, 'reason:', reason)
  if (workerConfig && worker) {
    workerConfig.shutdown(worker).then(() => process.exit(1))
  } else {
    process.exit(1)
  }
})

// Start the worker
start()
