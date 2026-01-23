import { Worker } from 'bullmq'
import { redisOptions } from '#config/redis'
import { SUMMARY_NOTES_QUEUE_NAME, JobTypes } from '#jobs/queues/summaryNotesQueue'
import {
  prepareEmbeddingsHandler,
  embedChunkHandler,
  deleteSummaryNoteEmbeddingHandler
} from '#jobs/workers/summaryNotes/index'
import prisma from '#prisma/client'

/**
 * Summary Notes Worker
 *
 * Processes background jobs for summary notes (embedding generation, etc.)
 */

// Job processor function
async function processSummaryNoteJob(job) {
  const { name, data } = job

  console.log(`\n🔄 Processing job: ${name} (ID: ${job.id})`)
  console.log(`   Data:`, data)

  try {
    switch (name) {
      case JobTypes.PREPARE_EMBEDDINGS:
        await prepareEmbeddingsHandler(job)
        break

      case JobTypes.EMBED_CHUNK:
        await embedChunkHandler(job)
        break

      case JobTypes.DELETE_EMBEDDINGS:
        await deleteSummaryNoteEmbeddingHandler(job)
        break

      default:
        throw new Error(`Unknown job type: ${name}`)
    }

    console.log(`✅ Job completed: ${name} (ID: ${job.id})`)
  } catch (error) {
    console.error(`❌ Job failed: ${name} (ID: ${job.id})`)
    console.error(`   Error:`, error.message)
    throw error // Re-throw to mark job as failed
  }
}

/**
 * Create and start the worker
 */
export function createSummaryNotesWorker() {
  const worker = new Worker(SUMMARY_NOTES_QUEUE_NAME, processSummaryNoteJob, {
    connection: redisOptions,
    concurrency: 5, // Reduced from 5 to 3 to avoid race conditions
    limiter: {
      max: 10, // Max 10 jobs
      duration: 1000 // per 1 second (rate limiting for API calls)
    }
  })
  console.log(redisOptions)

  // Event handlers
  worker.on('ready', () => {
    console.log('✓ Summary notes worker is ready')
  })

  worker.on('active', (job) => {
    console.log(`⚙️  Job started: ${job.name} (ID: ${job.id})`)
  })

  worker.on('completed', (job) => {
    console.log(`✅ Job completed: ${job.name} (ID: ${job.id})`)
  })

  worker.on('failed', (job, err) => {
    console.error(`❌ Job failed: ${job?.name} (ID: ${job?.id})`)
    console.error(`   Error: ${err.message}`)
    console.error(`   Attempts: ${job?.attemptsMade}/${job?.opts?.attempts}`)
  })

  worker.on('error', (err) => {
    console.error('Worker error:', err)
  })

  worker.on('stalled', (jobId) => {
    console.warn(`⚠️  Job stalled: ${jobId}`)
  })

  return worker
}

/**
 * Graceful shutdown
 */
export async function shutdownWorker(worker) {
  console.log('\n🛑 Shutting down summary notes worker...')
  await worker.close()
  await prisma.$disconnect()
  console.log('✓ Worker shut down gracefully')
}
