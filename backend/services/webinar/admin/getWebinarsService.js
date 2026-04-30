import prisma from '#prisma/client'
import attachmentService from '#services/attachment/attachmentService'

export class GetWebinarsService {
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
      ]
    }

    const webinars = await prisma.webinar_events.findMany({
      where,
      skip,
      take: perPageNum + 1,
      orderBy: { start_at: 'desc' },
      include: {
        _count: { select: { webinar_registrations: { where: { is_deleted: false } } } },
      },
    })

    const isLastPage = webinars.length <= perPageNum
    const data = isLastPage ? webinars : webinars.slice(0, perPageNum)

    const thumbnails = await Promise.all(
      data.map(w => attachmentService.getAttachmentWithUrl('webinar_event', w.id, 'thumbnail'))
    )

    return {
      data: data.map((w, i) => ({ ...w, thumbnail: thumbnails[i] })),
      pagination: { page: pageNum, perPage: perPageNum, isLastPage },
    }
  }
}
