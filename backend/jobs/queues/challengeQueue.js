import { Queue } from 'bullmq'
import { redisOptions } from '#config/redis'

function getQueueName(baseName) {
  const env = process.env.NODE_ENV || 'development'
  return env === 'development' ? `dev_${baseName}` : baseName
}

const BASE_QUEUE_NAME = 'challenge'
export const CHALLENGE_QUEUE_NAME = getQueueName(BASE_QUEUE_NAME)

export const challengeQueue = new Queue(CHALLENGE_QUEUE_NAME, {
  connection: redisOptions,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
    removeOnComplete: {
      age: 24 * 3600,
      count: 500,
    },
    removeOnFail: {
      age: 7 * 24 * 3600,
    },
  },
})

export const ChallengeJobTypes = {
  COMPLETE_CHALLENGE: 'complete-challenge',
}

export async function queueCompleteChallenge() {
  const job = await challengeQueue.add(
    ChallengeJobTypes.COMPLETE_CHALLENGE,
    { triggeredAt: new Date().toISOString() },
    { jobId: `complete-challenge-${Date.now()}` }
  )
  console.log(`📤 Queued complete-challenge job (Job ID: ${job.id})`)
  return job
}
