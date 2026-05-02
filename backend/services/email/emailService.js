import nodemailer from 'nodemailer'
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

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
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

    await this.transporter.sendMail({
      from: `"MedPal" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to,
      subject: `Registrasi Webinar Disetujui: ${webinarTitle}`,
      html,
    })
  }

  async sendWebinarRejection({ to, userName, webinarTitle, adminNotes }) {
    const html = getTemplate('webinarRejection.html')({
      userName,
      webinarTitle,
      adminNotes: adminNotes || null,
    })

    await this.transporter.sendMail({
      from: `"MedPal" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to,
      subject: `Registrasi Webinar Ditolak: ${webinarTitle}`,
      html,
    })
  }
}

export default new EmailService()
