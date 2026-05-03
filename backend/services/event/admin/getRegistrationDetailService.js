import { NotFoundError } from '#errors/notFoundError'
import prisma from '#prisma/client'
import attachmentService from '#services/attachment/attachmentService'

export class GetRegistrationDetailService {
  static async call(uniqueId) {
    const registration = await prisma.event_registrations.findFirst({
      where: { unique_id: uniqueId, is_deleted: false },
    })

    if (!registration) throw new NotFoundError('Registration not found')

    const [user, event, evidences] = await Promise.all([
      prisma.users.findUnique({
        where: { id: registration.user_id },
        select: { id: true, name: true, email: true },
      }),
      prisma.events.findUnique({
        where: { id: registration.event_id },
        select: { id: true, code: true, title: true, start_at: true },
      }),
      attachmentService.getAttachmentsWithUrls({
        recordType: 'event_registration',
        recordId: registration.id,
      }),
    ])

    return { ...registration, user, event, evidences }
  }
}
