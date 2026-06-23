import { Resend } from 'resend'

class ResendProvider {
  constructor() {
    this.client = new Resend(process.env.RESEND_API_KEY)
  }

  get defaultFrom() {
    return process.env.RESEND_FROM || 'MedPal <no-reply@medpal.id>'
  }

  async sendMail({ from, to, subject, html, attachments }) {
    const payload = {
      from: from ?? this.defaultFrom,
      to,
      subject,
      html,
    }

    if (attachments?.length) {
      payload.attachments = attachments.map(a => ({
        filename: a.filename,
        content: Buffer.isBuffer(a.content) ? a.content.toString('base64') : a.content,
      }))
    }

    const { error } = await this.client.emails.send(payload)
    if (error) throw new Error(`Resend error: ${error.message}`)
  }
}

export default new ResendProvider()
