import { ValidationError } from '#errors/validationError'
import { NotFoundError } from '#errors/notFoundError'
import prisma from '#prisma/client'
import { DisburseRegistrationService } from '#services/event/admin/disburseRegistrationService'

const VALID_STATUSES = ['approved', 'rejected']

export class ReviewRegistrationService {
  static async call({ uniqueId, status, adminNotes, reviewerId }) {
    if (!VALID_STATUSES.includes(status)) {
      throw new ValidationError('Status must be approved or rejected')
    }

    const registration = await prisma.event_registrations.findFirst({
      where: { unique_id: uniqueId, is_deleted: false },
    })

    if (!registration) throw new NotFoundError('Registration not found')

    if (registration.status !== 'pending') {
      throw new ValidationError('Only pending registrations can be reviewed')
    }

    const updated = await prisma.event_registrations.update({
      where: { id: registration.id },
      data: {
        status,
        admin_notes: adminNotes || null,
        reviewed_by: reviewerId,
        reviewed_at: new Date(),
        updated_at: new Date(),
      },
    })

    if (status === 'approved') {
      await DisburseRegistrationService.call(registration.id)
    }

    return updated
  }
}
