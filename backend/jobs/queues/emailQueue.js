import { Queue } from 'bullmq'
import { redisOptions } from '#config/redis'

function getQueueName(baseName) {
  const env = process.env.NODE_ENV || 'development'
  return env === 'development' ? `dev_${baseName}` : baseName
}

const BASE_QUEUE_NAME = 'email'
export const EMAIL_QUEUE_NAME = getQueueName(BASE_QUEUE_NAME)

export const emailQueue = new Queue(EMAIL_QUEUE_NAME, {
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

export const EmailJobTypes = {
  WEBINAR_APPROVAL: 'webinar-approval',
  WEBINAR_REJECTION: 'webinar-rejection',
  CHALLENGE_ANSWER_KEY: 'challenge-answer-key',
  TEST: 'test-email',
}

export async function queueWebinarApprovalEmail({ to, userName, webinarTitle, joinLinks, startAt }) {
  const job = await emailQueue.add(
    EmailJobTypes.WEBINAR_APPROVAL,
    { to, userName, webinarTitle, joinLinks, startAt },
    { jobId: `webinar-approval-${Date.now()}` }
  )
  console.log(`📤 Queued webinar approval email to ${to} (Job ID: ${job.id})`)
  return job
}

export async function queueWebinarRejectionEmail({ to, userName, webinarTitle, adminNotes }) {
  const job = await emailQueue.add(
    EmailJobTypes.WEBINAR_REJECTION,
    { to, userName, webinarTitle, adminNotes },
    { jobId: `webinar-rejection-${Date.now()}` }
  )
  console.log(`📤 Queued webinar rejection email to ${to} (Job ID: ${job.id})`)
  return job
}

export async function queueChallengeAnswerKeyEmail({ sessionId }) {
  const job = await emailQueue.add(
    EmailJobTypes.CHALLENGE_ANSWER_KEY,
    { sessionId },
    { jobId: `challenge-answer-key-${sessionId}-${Date.now()}` }
  )
  console.log(`📤 Queued challenge answer key email for session ${sessionId} (Job ID: ${job.id})`)
  return job
}

/**
 * Queue a no-op diagnostic email. Used to verify end to end that the email
 * worker is running and that the configured provider can actually deliver:
 * the job carries all its data inline, so it touches no other table and
 * cannot fail for reasons unrelated to the queue or the mail provider.
 */
export async function queueTestEmail({ to, requestedBy }) {
  const job = await emailQueue.add(
    EmailJobTypes.TEST,
    { to, requestedBy, queuedAt: new Date().toISOString() },
    { jobId: `test-email-${Date.now()}`, attempts: 1 }
  )
  console.log(`📤 Queued test email to ${to} (Job ID: ${job.id})`)
  return job
}
