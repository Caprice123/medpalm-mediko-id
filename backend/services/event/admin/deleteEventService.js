import { NotFoundError } from '#errors/notFoundError'
import prisma from '#prisma/client'

export class DeleteEventService {
  static async call(code) {
    const event = await prisma.events.findFirst({ where: { code, is_deleted: false } })
    if (!event) throw new NotFoundError('Event not found')

    await prisma.events.update({
      where: { id: event.id },
      data: { is_deleted: true, deleted_at: new Date() },
    })
  }
}
