import prisma from '#prisma/client'
import attachmentService from '#services/attachment/attachmentService'

export class GetEventsService {
  static async call({ page = 1, perPage = 20, status, search }) {
    const pageNum = parseInt(page)
    const perPageNum = parseInt(perPage)
    const skip = (pageNum - 1) * perPageNum

    const where = { is_deleted: false }
    if (status) where.status = status
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
      ]
    }

    const events = await prisma.events.findMany({
      where,
      skip,
      take: perPageNum + 1,
      orderBy: { start_at: 'desc' },
      include: {
        _count: { select: { event_registrations: { where: { is_deleted: false } } } },
      },
    })

    const isLastPage = events.length <= perPageNum
    const data = isLastPage ? events : events.slice(0, perPageNum)

    const thumbnails = await Promise.all(
      data.map(e => attachmentService.getAttachmentWithUrl('event', e.id, 'thumbnail'))
    )

    return {
      data: data.map((e, i) => ({ ...e, thumbnail: thumbnails[i] })),
      pagination: { page: pageNum, perPage: perPageNum, isLastPage },
    }
  }
}
