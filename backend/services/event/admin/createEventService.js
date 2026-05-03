import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import attachmentService from '#services/attachment/attachmentService'

export class CreateEventService {
  static async call({ code, title, description, registrationStartAt, registrationEndAt, status, thumbnailBlobId, creditsOnApproval, creditType, creditExpiryDays, allowedFeatures, createdBy }) {
    await this.validate({ code, title })

    const existing = await prisma.events.findFirst({ where: { code } })
    if (existing) throw new ValidationError('Code already in use')

    const event = await prisma.events.create({
      data: {
        code,
        title,
        description: description || null,
        registration_start_at: registrationStartAt ? new Date(registrationStartAt) : null,
        registration_end_at: registrationEndAt ? new Date(registrationEndAt) : null,
        status: status || 'draft',
        credits_on_approval: creditsOnApproval ? parseInt(creditsOnApproval) : 0,
        credit_type: creditType || 'permanent',
        credit_expiry_days: creditExpiryDays ? parseInt(creditExpiryDays) : null,
        allowed_features: allowedFeatures || [],
        created_by: createdBy,
      },
    })

    if (thumbnailBlobId) {
      await attachmentService.attach({
        blobId: parseInt(thumbnailBlobId),
        recordType: 'event',
        recordId: event.id,
        name: 'thumbnail',
      })
    }

    return event
  }

  static async validate({ code, title }) {
    if (!code || !code.trim()) throw new ValidationError('Code is required')
    if (!title || !title.trim()) throw new ValidationError('Title is required')
  }
}
