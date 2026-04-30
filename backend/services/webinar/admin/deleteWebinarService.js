import { NotFoundError } from '#errors/notFoundError'
import prisma from '#prisma/client'

export class DeleteWebinarService {
  static async call(uniqueId) {
    const webinar = await prisma.webinar_events.findFirst({
      where: { unique_id: uniqueId, is_deleted: false },
    })

    if (!webinar) throw new NotFoundError('Webinar not found')

    await prisma.webinar_events.update({
      where: { id: webinar.id },
      data: { is_deleted: true, deleted_at: new Date() },
    })
  }
}
