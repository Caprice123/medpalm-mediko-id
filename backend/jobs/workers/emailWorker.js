import { Worker } from 'bullmq'
import { redisOptions } from '#config/redis'
import { EMAIL_QUEUE_NAME, EmailJobTypes } from '#jobs/queues/emailQueue'
import emailService from '#services/email/emailService'

async function processEmailJob(job) {
  const { name, data } = job
  console.log(`\n🔄 Processing email job: ${name} (ID: ${job.id})`)

  switch (name) {
    case EmailJobTypes.WEBINAR_APPROVAL:
      await emailService.sendWebinarApproval(data)
      break

    case EmailJobTypes.WEBINAR_REJECTION:
      await emailService.sendWebinarRejection(data)
      break

    case EmailJobTypes.CHALLENGE_ANSWER_KEY:
      await emailService.sendChallengeAnswerKey(data)
      break

    default:
      throw new Error(`Unknown email job type: ${name}`)
  }

  console.log(`✅ Email job completed: ${name} (ID: ${job.id})`)
}

export function createEmailWorker() {
  const worker = new Worker(EMAIL_QUEUE_NAME, processEmailJob, {
    connection: redisOptions,
    concurrency: 3,
  })

  worker.on('ready', () => console.log('✓ Email worker is ready'))
  worker.on('completed', (job) => console.log(`✅ Email sent: ${job.name} (ID: ${job.id})`))
  worker.on('failed', (job, err) => {
    console.error(`❌ Email job failed: ${job?.name} (ID: ${job?.id})`)
    console.error(`   Error: ${err.message}`)
    console.error(`   Attempts: ${job?.attemptsMade}/${job?.opts?.attempts}`)
  })
  worker.on('error', (err) => console.error('Email worker error:', err))

  return worker
}

export async function shutdownWorker(worker) {
  console.log('\n🛑 Shutting down email worker...')
  await worker.close()
  console.log('✓ Email worker shut down gracefully')
}
