import Handlebars from 'handlebars'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import { generateChallengeAnswerKeyPdf } from '#services/pdf/challengeAnswerKeyPdf'

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
  /**
   * Diagnostic email with no template file and no database lookup, so a
   * failure here points at the queue, the worker or the mail provider and
   * nothing else.
   */
  async sendTestEmail({ to, requestedBy, queuedAt }) {
    const html = [
      '<h2>Test email MedPal</h2>',
      '<p>Kalau email ini sampai, worker email dan provider pengiriman berjalan normal.</p>',
      '<ul>',
      `<li>Dikirim ke: ${to}</li>`,
      `<li>Diminta oleh: ${requestedBy || '-'}</li>`,
      `<li>Masuk antrian: ${queuedAt || '-'}</li>`,
      `<li>Diproses: ${new Date().toISOString()}</li>`,
      '</ul>',
    ].join('')

    const provider = await providerPromise
    await provider.sendMail({ to, subject: 'Test Email MedPal', html })
  }
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
    const html = getTemplate('challengeAnswerKeyNotification.html')({
      userName,
      challengeTitle,
      score,
      finalRank,
    })

    const pdfBuffer = await generateChallengeAnswerKeyPdf({
      userName,
      challengeTitle,
      score,
      finalRank,
      questions,
    })

    const provider = await providerPromise
    await provider.sendMail({
      to,
      subject: `Kunci Jawaban: ${challengeTitle}`,
      html,
      attachments: [
        {
          filename: `kunci-jawaban-${challengeTitle.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    })
  }
}

export default new EmailService()
