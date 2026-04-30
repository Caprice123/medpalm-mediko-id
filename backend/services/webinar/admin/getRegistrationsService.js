import { NotFoundError } from '#errors/notFoundError'
import prisma from '#prisma/client'
import attachmentService from '#services/attachment/attachmentService'

export class GetRegistrationsService {
  static async call({ webinarUniqueId, page = 1, perPage = 20, status }) {
    const pageNum = parseInt(page)
    const perPageNum = parseInt(perPage)
    const skip = (pageNum - 1) * perPageNum

    const webinar = await prisma.webinar_events.findFirst({
      where: { unique_id: webinarUniqueId, is_deleted: false },
    })

    if (!webinar) throw new NotFoundError('Webinar not found')

    const where = { webinar_id: webinar.id, is_deleted: false }
    if (status) where.status = status

    const registrations = await prisma.webinar_registrations.findMany({
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
            recordType: 'webinar_registration',
            recordId: r.id,
            name: 'evidence',
          })
        )
      ),
    ])

    const userMap = new Map(users.map(u => [u.id, u]))

    return {
      data: data.map((r, i) => ({
        ...r,
        user: userMap.get(r.user_id) || null,
        evidences: evidencesPerReg[i],
      })),
      pagination: { page: pageNum, perPage: perPageNum, isLastPage },
    }
  }
}
