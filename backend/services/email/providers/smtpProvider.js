import nodemailer from 'nodemailer'

class SmtpProvider {
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

  get defaultFrom() {
    return `"MedPal" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`
  }

  async sendMail({ from, to, subject, html, attachments }) {
    await this.transporter.sendMail({
      from: from ?? this.defaultFrom,
      to,
      subject,
      html,
      ...(attachments?.length ? { attachments } : {}),
    })
  }
}

export default new SmtpProvider()
