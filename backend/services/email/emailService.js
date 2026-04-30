import nodemailer from 'nodemailer'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function loadTemplate(filename) {
  return fs.readFileSync(path.join(__dirname, 'templates', filename), 'utf-8')
}

function renderTemplate(template, variables) {
  return Object.entries(variables).reduce(
    (html, [key, value]) => html.replaceAll(`{{${key}}}`, value ?? ''),
    template
  )
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

    const links = Array.isArray(joinLinks) ? joinLinks : []
    const joinLinksHtml = links.map(l =>
      `<div style="margin-bottom: 10px;">
        <a href="${l.url}" style="display:inline-block;background:linear-gradient(135deg,#6BB9E8 0%,#8DC63F 100%);color:white;padding:10px 24px;border-radius:6px;text-decoration:none;font-weight:700;font-size:14px;">${l.label} →</a>
      </div>`
    ).join('')

    const html = renderTemplate(loadTemplate('webinarApproval.html'), {
      userName,
      webinarTitle,
      joinLinksHtml,
      formattedDate,
    })

    await this.transporter.sendMail({
      from: `"MedPalm" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to,
      subject: `Registrasi Webinar Disetujui: ${webinarTitle}`,
      html,
    })
  }

  async sendWebinarRejection({ to, userName, webinarTitle, adminNotes }) {
    const adminNotesBlock = adminNotes
      ? `<div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 10px; padding: 16px; margin-bottom: 24px;">
           <p style="margin: 0; color: #991b1b; font-size: 14px;">
             <strong>Catatan dari admin:</strong><br />${adminNotes}
           </p>
         </div>`
      : ''

    const html = renderTemplate(loadTemplate('webinarRejection.html'), {
      userName,
      webinarTitle,
      adminNotesBlock,
    })

    await this.transporter.sendMail({
      from: `"MedPalm" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to,
      subject: `Registrasi Webinar Ditolak: ${webinarTitle}`,
      html,
    })
  }
}

export default new EmailService()
