import { ValidationError } from '#errors/validationError'
import { NotFoundError } from '#errors/notFoundError'
import prisma from '#prisma/client'
import attachmentService from '#services/attachment/attachmentService'

export class UpdateEventService {
  static async call({ code, title, description, registrationStartAt, registrationEndAt, status, thumbnailBlobId, creditsOnApproval, creditType, creditExpiryDays, allowedFeatures }) {
    const event = await prisma.events.findFirst({ where: { code, is_deleted: false } })
    if (!event) throw new NotFoundError('Event not found')

    if (!title || !title.trim()) throw new ValidationError('Title is required')

    const updated = await prisma.events.update({
      where: { id: event.id },
      data: {
        title,
        description: description || null,
        registration_start_at: registrationStartAt ? new Date(registrationStartAt) : null,
        registration_end_at: registrationEndAt ? new Date(registrationEndAt) : null,
        status,
        credits_on_approval: creditsOnApproval ? parseInt(creditsOnApproval) : 0,
        credit_type: creditType || 'permanent',
        credit_expiry_days: creditExpiryDays ? parseInt(creditExpiryDays) : null,
        allowed_features: allowedFeatures || [],
        updated_at: new Date(),
      },
    })

    if (thumbnailBlobId) {
      await attachmentService.detachAll({ recordType: 'event', recordId: event.id })
      await attachmentService.attach({
        blobId: parseInt(thumbnailBlobId),
        recordType: 'event',
        recordId: event.id,
        name: 'thumbnail',
      })
    }

    return updated
  }
}
