import { ValidationError } from '#errors/validationError'
import { NotFoundError } from '#errors/notFoundError'
import prisma from '#prisma/client'
import attachmentService from '#services/attachment/attachmentService'

export class RegisterEventService {
  static async call({ eventCode, userId, blobIds }) {
    if (!blobIds || blobIds.length === 0) {
      throw new ValidationError('At least one evidence file is required')
    }

    const event = await prisma.events.findFirst({
      where: { code: eventCode, is_deleted: false, status: 'published' },
    })

    if (!event) throw new NotFoundError('Event not found')

    // Block if there is already a pending or approved registration
    const activeRegistration = await prisma.event_registrations.findFirst({
      where: { event_id: event.id, user_id: userId, status: { in: ['pending', 'approved'] }, is_deleted: false },
    })

    if (activeRegistration?.status === 'approved') {
      throw new ValidationError('You have already been approved for this event')
    }
    if (activeRegistration?.status === 'pending') {
      throw new ValidationError('Your registration is already pending review')
    }

    // Create a new row (preserves history)
    const registration = await prisma.event_registrations.create({
      data: { event_id: event.id, user_id: userId, status: 'pending' },
    })

    await Promise.all(
      blobIds.map((blobId, index) =>
        attachmentService.attach({
          blobId: parseInt(blobId),
          recordType: 'event_registration',
          recordId: registration.id,
          name: `evidence_${index}`,
        })
      )
    )

    return registration
  }
}
