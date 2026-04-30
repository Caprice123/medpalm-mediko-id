import { ValidationError } from '#errors/validationError'
import { NotFoundError } from '#errors/notFoundError'
import prisma from '#prisma/client'
import attachmentService from '#services/attachment/attachmentService'

export class RegisterWebinarService {
  static async call({ webinarUniqueId, userId, blobIds }) {
    if (!blobIds || blobIds.length === 0) {
      throw new ValidationError('At least one evidence file is required')
    }

    const webinar = await prisma.webinar_events.findFirst({
      where: { unique_id: webinarUniqueId, is_deleted: false, status: 'published' },
    })

    if (!webinar) throw new NotFoundError('Webinar not found')

    const existing = await prisma.webinar_registrations.findFirst({
      where: { webinar_id: webinar.id, user_id: userId, is_deleted: false },
    })

    if (existing) throw new ValidationError('You have already registered for this webinar')

    const registration = await prisma.webinar_registrations.create({
      data: {
        webinar_id: webinar.id,
        user_id: userId,
        status: 'pending',
      },
    })

    await Promise.all(
      blobIds.map((blobId, index) =>
        attachmentService.attach({
          blobId: parseInt(blobId),
          recordType: 'webinar_registration',
          recordId: registration.id,
          name: `evidence_${index}`,
        })
      )
    )

    return registration
  }
}
