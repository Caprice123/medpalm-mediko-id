import { Worker } from 'bullmq'
import { redisOptions } from '#config/redis'
import { EMAIL_QUEUE_NAME, EmailJobTypes } from '#jobs/queues/emailQueue'
import emailService from '#services/email/emailService'
import prisma from '#client'
import attachmentService from '#services/attachment/attachmentService'
import idriveService from '#services/idrive.service'

const OPTION_LABELS = ['A', 'B', 'C', 'D', 'E']

async function fetchImageBuffer(questionId, name) {
  try {
    const attachments = await attachmentService.getAttachments('challenge_question', questionId, name)
    if (!attachments.length) return null
    return await idriveService.downloadFileAsBuffer(attachments[0].blob.key)
  } catch (e) {
    console.warn(`[email] Failed to fetch image "${name}" for question ${questionId}:`, e.message)
    return null
  }
}

async function buildChallengeAnswerKeyPayload({ sessionId }) {
  const session = await prisma.challenge_sessions.findUnique({
    where: { id: sessionId },
    include: {
      challenge: { select: { title: true } },
      challenge_session_answers: {
        include: { challenge_question: true },
        orderBy: { challenge_question: { order: 'asc' } },
      },
    },
  })

  if (!session) throw new Error(`Session ${sessionId} not found`)

  const user = await prisma.users.findUnique({
    where: { id: session.user_id },
    select: { name: true, email: true },
  })

  if (!user?.email) throw new Error(`No user/email for session ${sessionId}`)

  const questions = await Promise.all(
    session.challenge_session_answers.map(async (a, idx) => {
      const q = a.challenge_question
      const options = Array.isArray(q.options) ? q.options : []

      // Fetch question image + all option images in parallel
      const [questionImageBuffer, ...optionImageBuffers] = await Promise.all([
        fetchImageBuffer(q.id, 'question_image'),
        ...options.map((_, i) => fetchImageBuffer(q.id, `option_image_${i}`)),
      ])

      return {
        num: idx + 1,
        questionText: q.question || '',
        selectedOption: a.selected_option_index !== null
          ? `${OPTION_LABELS[a.selected_option_index] ?? a.selected_option_index}. ${options[a.selected_option_index] ?? ''}`
          : 'Tidak dijawab',
        correctOption: `${OPTION_LABELS[q.correct_option_index] ?? q.correct_option_index}. ${options[q.correct_option_index] ?? ''}`,
        isCorrect: a.is_correct,
        explanation: q.explanation || null,
        questionImageBuffer,
        optionImageBuffers,
      }
    })
  )

  return {
    to: user.email,
    userName: user.name,
    challengeTitle: session.challenge.title,
    score: (session.score ?? 0).toFixed(0),
    correctCount: session.correct_count ?? 0,
    totalQuestions: questions.length,
    finalRank: session.final_rank,
    questions,
  }
}

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

    case EmailJobTypes.CHALLENGE_ANSWER_KEY: {
      const payload = await buildChallengeAnswerKeyPayload(data)
      await emailService.sendChallengeAnswerKey(payload)
      break
    }

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
    console.error(`   Error: ${err.stack}`)
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
