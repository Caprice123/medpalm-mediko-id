import { Worker } from 'bullmq'
import { redisOptions } from '#config/redis'
import { CHALLENGE_QUEUE_NAME, ChallengeJobTypes } from '#jobs/queues/challengeQueue'
import { CompleteChallengeService } from '#services/challenge/completeChallengeService'

async function processChallengeJob(job) {
  const { name } = job
  console.log(`\n🔄 Processing challenge job: ${name} (ID: ${job.id})`)

  switch (name) {
    case ChallengeJobTypes.COMPLETE_CHALLENGE: {
      const count = await CompleteChallengeService.call()
      if (count > 0) {
        console.log(`[worker] Completed ${count} challenge(s)`)
      }
      break
    }
    default:
      throw new Error(`Unknown challenge job type: ${name}`)
  }

  console.log(`✅ Challenge job completed: ${name} (ID: ${job.id})`)
}

export function createChallengeWorker() {
  const worker = new Worker(CHALLENGE_QUEUE_NAME, processChallengeJob, {
    connection: redisOptions,
    concurrency: 1,
  })

  worker.on('ready', () => console.log('✓ Challenge worker is ready'))
  worker.on('completed', (job) => console.log(`✅ Challenge job done: ${job.name} (ID: ${job.id})`))
  worker.on('failed', (job, err) => {
    console.error(`❌ Challenge job failed: ${job?.name} (ID: ${job?.id})`)
    console.error(`   Error: ${err.stack}`)
    console.error(`   Attempts: ${job?.attemptsMade}/${job?.opts?.attempts}`)
  })
  worker.on('error', (err) => console.error('Challenge worker error:', err))

  return worker
}

export async function shutdownWorker(worker) {
  console.log('\n🛑 Shutting down challenge worker...')
  await worker.close()
  console.log('✓ Challenge worker shut down gracefully')
}
