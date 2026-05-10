import { Resend } from 'resend'

class ResendProvider {
  constructor() {
    this.client = new Resend(process.env.RESEND_API_KEY)
  }

  get defaultFrom() {
    return process.env.RESEND_FROM || 'MedPal <no-reply@medpal.id>'
  }

  async sendMail({ from, to, subject, html }) {
    const { error } = await this.client.emails.send({
      from: from ?? this.defaultFrom,
      to,
      subject,
      html,
    })
    if (error) throw new Error(`Resend error: ${error.message}`)
  }
}

export default new ResendProvider()
