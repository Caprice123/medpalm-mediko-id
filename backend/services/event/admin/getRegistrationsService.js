import { NotFoundError } from '#errors/notFoundError'
import prisma from '#prisma/client'
import attachmentService from '#services/attachment/attachmentService'

export class GetRegistrationsService {
  static async call({ eventCode, page = 1, perPage = 20, status }) {
    const pageNum = parseInt(page)
    const perPageNum = parseInt(perPage)
    const skip = (pageNum - 1) * perPageNum

    const event = await prisma.events.findFirst({ where: { code: eventCode, is_deleted: false } })
    if (!event) throw new NotFoundError('Event not found')

    const where = { event_id: event.id, is_deleted: false }
    if (status) where.status = status

    const registrations = await prisma.event_registrations.findMany({
      where,
      skip,
      take: perPageNum + 1,
      orderBy: { created_at: 'desc' },
    })

    const isLastPage = registrations.length <= perPageNum
    const data = isLastPage ? registrations : registrations.slice(0, perPageNum)

    const [users, evidencesPerReg] = await Promise.all([
      prisma.users.findMany({
        where: { id: { in: data.map(r => r.user_id) } },
        select: { id: true, name: true, email: true },
      }),
      Promise.all(
        data.map(r =>
          attachmentService.getAttachmentsWithUrls({
            recordType: 'event_registration',
            recordId: r.id,
            name: 'evidence',
          })
        )
      ),
    ])

    const userMap = new Map(users.map(u => [u.id, u]))

    return {
      data: data.map((r, i) => ({ ...r, user: userMap.get(r.user_id) || null, evidences: evidencesPerReg[i] })),
      pagination: { page: pageNum, perPage: perPageNum, isLastPage },
    }
  }
}
