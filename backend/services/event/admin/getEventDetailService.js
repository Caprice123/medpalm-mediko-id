import { NotFoundError } from '#errors/notFoundError'
import prisma from '#prisma/client'
import attachmentService from '#services/attachment/attachmentService'

export class GetEventDetailService {
  static async call(code) {
    const event = await prisma.events.findFirst({
      where: { code, is_deleted: false },
      include: {
        _count: { select: { event_registrations: { where: { is_deleted: false } } } },
      },
    })

    if (!event) throw new NotFoundError('Event not found')

    const thumbnail = await attachmentService.getAttachmentWithUrl('event', event.id, 'thumbnail')

    return { ...event, thumbnail }
  }
}
