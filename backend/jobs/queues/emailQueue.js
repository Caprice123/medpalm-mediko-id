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

export async function queueChallengeAnswerKeyEmail({ to, userName, challengeTitle, score, correctCount, totalQuestions, finalRank, questions }) {
  const job = await emailQueue.add(
    EmailJobTypes.CHALLENGE_ANSWER_KEY,
    { to, userName, challengeTitle, score, correctCount, totalQuestions, finalRank, questions },
    { jobId: `challenge-answer-key-${to}-${Date.now()}` }
  )
  console.log(`📤 Queued challenge answer key email to ${to} (Job ID: ${job.id})`)
  return job
}
