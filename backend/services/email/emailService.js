import Handlebars from 'handlebars'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const templateCache = {}

function getTemplate(filename) {
  if (!templateCache[filename]) {
    const source = fs.readFileSync(path.join(__dirname, 'templates', filename), 'utf-8')
    templateCache[filename] = Handlebars.compile(source)
  }
  return templateCache[filename]
}

async function loadProvider() {
  const provider = (process.env.EMAIL_PROVIDER || 'smtp').toLowerCase()
  if (provider === 'resend') {
    return (await import('./providers/resendProvider.js')).default
  }
  return (await import('./providers/smtpProvider.js')).default
}

const providerPromise = loadProvider()

class EmailService {
  async sendWebinarApproval({ to, userName, webinarTitle, joinLinks, startAt }) {
    const formattedDate = new Date(startAt).toLocaleString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Jakarta',
    })

    const html = getTemplate('webinarApproval.html')({
      userName,
      webinarTitle,
      formattedDate,
      joinLinks: Array.isArray(joinLinks) ? joinLinks : [],
    })

    const provider = await providerPromise
    await provider.sendMail({ to, subject: `Registrasi Webinar Disetujui: ${webinarTitle}`, html })
  }

  async sendWebinarRejection({ to, userName, webinarTitle, adminNotes }) {
    const html = getTemplate('webinarRejection.html')({
      userName,
      webinarTitle,
      adminNotes: adminNotes || null,
    })

    const provider = await providerPromise
    await provider.sendMail({ to, subject: `Registrasi Webinar Ditolak: ${webinarTitle}`, html })
  }

  async sendChallengeAnswerKey({ to, userName, challengeTitle, score, correctCount, totalQuestions, finalRank, questions }) {
    const html = getTemplate('challengeAnswerKey.html')({
      userName,
      challengeTitle,
      score,
      correctCount,
      totalQuestions,
      finalRank,
      questions,
    })

    const provider = await providerPromise
    await provider.sendMail({ to, subject: `Kunci Jawaban: ${challengeTitle}`, html })
  }
}

export default new EmailService()
