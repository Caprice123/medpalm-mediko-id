import { NotFoundError } from '#errors/notFoundError'
import prisma from '#prisma/client'
import attachmentService from '#services/attachment/attachmentService'

export class GetRegistrationDetailService {
  static async call(uniqueId) {
    const registration = await prisma.webinar_registrations.findFirst({
      where: { unique_id: uniqueId, is_deleted: false },
    })

    if (!registration) throw new NotFoundError('Registration not found')

    const [user, webinar, evidences] = await Promise.all([
      prisma.users.findUnique({
        where: { id: registration.user_id },
        select: { id: true, name: true, email: true },
      }),
      prisma.webinar_events.findUnique({
        where: { id: registration.webinar_id },
        select: { id: true, unique_id: true, title: true, start_at: true },
      }),
      attachmentService.getAttachmentsWithUrls({
        recordType: 'webinar_registration',
        recordId: registration.id,
      }),
    ])

    return { ...registration, user, webinar, evidences }
  }
}
