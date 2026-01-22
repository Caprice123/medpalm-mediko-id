import { Queue } from 'bullmq'
import { redisOptions } from '#config/redis'

/**
 * Summary Notes Queue
 *
 * Handles background processing for summary note operations (embeddings, etc.)
 */

/**
 * Get queue name with environment prefix
 * @param {string} baseName - Base queue name
 * @returns {string} - Prefixed queue name
 */
function getQueueName(baseName) {
  const env = process.env.NODE_ENV || 'development'
  if (env === 'development') {
    return `dev_${baseName}`
  }
  return baseName
}

const BASE_QUEUE_NAME = 'summary-notes'
export const SUMMARY_NOTES_QUEUE_NAME = getQueueName(BASE_QUEUE_NAME)

export const summaryNotesQueue = new Queue(SUMMARY_NOTES_QUEUE_NAME, {
  connection: redisOptions,
  defaultJobOptions: {
    attempts: 3, // Retry up to 3 times on failure
    backoff: {
      type: 'exponential',
      delay: 2000 // Start with 2 second delay, exponentially increase
    },
    removeOnComplete: {
      age: 24 * 3600, // Keep completed jobs for 24 hours
      count: 1000 // Keep last 1000 completed jobs
    },
    removeOnFail: {
      age: 7 * 24 * 3600 // Keep failed jobs for 7 days
    }
  }
})

/**
 * Job Types
 */
export const JobTypes = {
  PREPARE_EMBEDDINGS: 'prepare-embeddings', // Chunk and queue individual chunk jobs
  EMBED_CHUNK: 'embed-chunk', // Process a single chunk
  DELETE_EMBEDDINGS: 'delete-embeddings' // Delete all embeddings for a note
}

/**
 * Add a job to prepare embeddings for a summary note (chunks and queues chunk jobs)
 * @param {number} summaryNoteId - ID of the summary note to embed
 * @param {Object} options - Job options
 */
export async function queueEmbedSummaryNote(summaryNoteId, options = {}) {
  const job = await summaryNotesQueue.add(
    JobTypes.PREPARE_EMBEDDINGS,
    { summaryNoteId },
    {
      ...options,
      jobId: `prepare-${summaryNoteId}-${Date.now()}` // Unique job ID
    }
  )

  console.log(`📤 Queued preparation job for note ${summaryNoteId} (Job ID: ${job.id})`)
  return job
}

/**
 * Add a job to embed a single chunk
 * @param {Object} chunkData - Chunk data
 * @param {number} chunkData.summaryNoteId - ID of the summary note
 * @param {number} chunkData.chunkIndex - Index of this chunk
 * @param {Object} chunkData.chunk - Chunk object with content, heading, etc.
 * @param {Object} chunkData.metadata - Metadata for the chunk
 */
export async function queueEmbedChunk(chunkData) {
  const { summaryNoteId, chunkIndex } = chunkData

  const job = await summaryNotesQueue.add(
    JobTypes.EMBED_CHUNK,
    chunkData,
    {
      jobId: `embed-chunk-${summaryNoteId}-${chunkIndex}-${Date.now()}`
    }
  )

  return job
}

/**
 * Add a job to delete embeddings for a summary note
 * @param {number} summaryNoteId - ID of the summary note
 */
export async function queueDeleteSummaryNoteEmbedding(summaryNoteId) {
  const job = await summaryNotesQueue.add(
    JobTypes.DELETE_EMBEDDINGS,
    { summaryNoteId },
    {
      jobId: `delete-embedding-${summaryNoteId}-${Date.now()}`
    }
  )

  console.log(`📤 Queued deletion job for note ${summaryNoteId} embeddings (Job ID: ${job.id})`)
  return job
}

/**
 * Get queue stats
 */
export async function getQueueStats() {
  const [waiting, active, completed, failed, delayed] = await Promise.all([
    summaryNotesQueue.getWaitingCount(),
    summaryNotesQueue.getActiveCount(),
    summaryNotesQueue.getCompletedCount(),
    summaryNotesQueue.getFailedCount(),
    summaryNotesQueue.getDelayedCount()
  ])

  return {
    waiting,
    active,
    completed,
    failed,
    delayed,
    total: waiting + active + completed + failed + delayed
  }
}

/**
 * Clear all jobs (useful for testing/debugging)
 */
export async function clearQueue() {
  await summaryNotesQueue.drain()
  await summaryNotesQueue.clean(0, 0, 'completed')
  await summaryNotesQueue.clean(0, 0, 'failed')
  console.log('✓ Summary notes queue cleared')
}
