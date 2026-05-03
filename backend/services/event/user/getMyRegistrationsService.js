import prisma from '#prisma/client'
import attachmentService from '#services/attachment/attachmentService'

export class GetMyRegistrationsService {
  static async call({ userId, page = 1, perPage = 20 }) {
    const pageNum = parseInt(page)
    const perPageNum = parseInt(perPage)
    const skip = (pageNum - 1) * perPageNum

    const registrations = await prisma.event_registrations.findMany({
      where: { user_id: userId, is_deleted: false },
      skip,
      take: perPageNum + 1,
      orderBy: { created_at: 'desc' },
    })

    const isLastPage = registrations.length <= perPageNum
    const data = isLastPage ? registrations : registrations.slice(0, perPageNum)

    const events = await prisma.events.findMany({
      where: { id: { in: data.map(r => r.event_id) } },
    })
    const eventMap = new Map(events.map(e => [e.id, e]))

    const evidencesPerReg = await Promise.all(
      data.map(r =>
        attachmentService.getAttachmentsWithUrls({ recordType: 'event_registration', recordId: r.id })
      )
    )

    return {
      data: data.map((r, i) => ({
        ...r,
        event: eventMap.get(r.event_id) || null,
        evidences: evidencesPerReg[i],
      })),
      pagination: { page: pageNum, perPage: perPageNum, isLastPage },
    }
  }
}
