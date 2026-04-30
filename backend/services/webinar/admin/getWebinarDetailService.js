import { NotFoundError } from '#errors/notFoundError'
import prisma from '#prisma/client'
import attachmentService from '#services/attachment/attachmentService'

export class GetWebinarDetailService {
  static async call(uniqueId) {
    const webinar = await prisma.webinar_events.findFirst({
      where: { unique_id: uniqueId, is_deleted: false },
      include: {
        _count: { select: { webinar_registrations: { where: { is_deleted: false } } } },
      },
    })

    if (!webinar) throw new NotFoundError('Webinar not found')

    const thumbnail = await attachmentService.getAttachmentWithUrl('webinar_event', webinar.id, 'thumbnail')

    return { ...webinar, thumbnail }
  }
}
