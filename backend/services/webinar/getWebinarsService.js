import prisma from '#prisma/client'
import attachmentService from '#services/attachment/attachmentService'

export class GetWebinarsService {
  static async call({ page = 1, perPage = 20, search, userId }) {
    const pageNum = parseInt(page)
    const perPageNum = parseInt(perPage)
    const skip = (pageNum - 1) * perPageNum

    const where = { is_deleted: false, status: 'published' }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    const webinars = await prisma.webinar_events.findMany({
      where,
      skip,
      take: perPageNum + 1,
      orderBy: { start_at: 'asc' },
    })

    const isLastPage = webinars.length <= perPageNum
    const data = isLastPage ? webinars : webinars.slice(0, perPageNum)

    const [thumbnails, userRegistrations] = await Promise.all([
      Promise.all(data.map(w => attachmentService.getAttachmentWithUrl('webinar_event', w.id, 'thumbnail'))),
      userId
        ? prisma.webinar_registrations.findMany({
            where: { user_id: userId, webinar_id: { in: data.map(w => w.id) }, is_deleted: false },
            select: { webinar_id: true },
          })
        : [],
    ])

    const registeredWebinarIds = new Set(userRegistrations.map(r => r.webinar_id))

    return {
      data: data.map((w, i) => ({
        ...w,
        thumbnail: thumbnails[i],
        isRegistered: registeredWebinarIds.has(w.id),
      })),
      pagination: { page: pageNum, perPage: perPageNum, isLastPage },
    }
  }
}
