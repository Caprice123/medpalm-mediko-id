import { ValidationError } from '#errors/validationError'
import { NotFoundError } from '#errors/notFoundError'
import prisma from '#prisma/client'
import attachmentService from '#services/attachment/attachmentService'
import { queueWebinarApprovalEmail } from '#jobs/queues/emailQueue'

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

    if (existing && existing.status !== 'rejected') {
      throw new ValidationError('You have already registered for this webinar')
    }

    let registration

    if (existing && existing.status === 'rejected') {
      registration = await prisma.webinar_registrations.update({
        where: { id: existing.id },
        data: { status: 'approved', admin_notes: null, reviewed_by: null, reviewed_at: null, updated_at: new Date() },
      })
      await attachmentService.detachAll({ recordType: 'webinar_registration', recordId: existing.id })
    } else {
      registration = await prisma.webinar_registrations.create({
        data: { webinar_id: webinar.id, user_id: userId, status: 'approved' },
      })
    }

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

    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: { name: true, email: true },
    })

    if (user?.email) {
      await queueWebinarApprovalEmail({
        to: user.email,
        userName: user.name || user.email,
        webinarTitle: webinar.title,
        joinLinks: webinar.join_url || [],
        startAt: webinar.start_at,
      })
    }

    return registration
  }
}
