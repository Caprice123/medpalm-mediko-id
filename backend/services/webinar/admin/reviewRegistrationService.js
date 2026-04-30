import { ValidationError } from '#errors/validationError'
import { NotFoundError } from '#errors/notFoundError'
import prisma from '#prisma/client'
import { queueWebinarApprovalEmail, queueWebinarRejectionEmail } from '#jobs/queues/emailQueue'

const VALID_STATUSES = ['approved', 'rejected']

export class ReviewRegistrationService {
  static async call({ uniqueId, status, adminNotes, reviewerId }) {
    if (!VALID_STATUSES.includes(status)) {
      throw new ValidationError('Status must be approved or rejected')
    }

    const registration = await prisma.webinar_registrations.findFirst({
      where: { unique_id: uniqueId, is_deleted: false },
    })

    if (!registration) throw new NotFoundError('Registration not found')

    if (registration.status !== 'pending') {
      throw new ValidationError('Only pending registrations can be reviewed')
    }

    const updated = await prisma.webinar_registrations.update({
      where: { id: registration.id },
      data: {
        status,
        admin_notes: adminNotes || null,
        reviewed_by: reviewerId,
        reviewed_at: new Date(),
        updated_at: new Date(),
      },
    })

    const [webinar, user] = await Promise.all([
      prisma.webinar_events.findUnique({ where: { id: registration.webinar_id } }),
      prisma.users.findUnique({
        where: { id: registration.user_id },
        select: { id: true, name: true, email: true },
      }),
    ])

    if (user?.email && webinar) {
      if (status === 'approved') {
        await queueWebinarApprovalEmail({
          to: user.email,
          userName: user.name || user.email,
          webinarTitle: webinar.title,
          joinLinks: webinar.join_url || [],
          startAt: webinar.start_at,
        })
      } else {
        await queueWebinarRejectionEmail({
          to: user.email,
          userName: user.name || user.email,
          webinarTitle: webinar.title,
          adminNotes: adminNotes || null,
        })
      }
    }

    return updated
  }
}
