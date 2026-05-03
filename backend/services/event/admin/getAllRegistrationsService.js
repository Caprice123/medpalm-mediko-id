import prisma from '#prisma/client'

export class GetAllRegistrationsService {
  static async call({ page = 1, perPage = 20, status, search, eventId }) {
    const pageNum = parseInt(page)
    const perPageNum = parseInt(perPage)
    const skip = (pageNum - 1) * perPageNum

    const where = { is_deleted: false }
    if (status) where.status = status
    if (eventId) where.event_id = parseInt(eventId)

    if (search) {
      const matchedUsers = await prisma.users.findMany({
        where: {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        },
        select: { id: true },
      })
      where.user_id = { in: matchedUsers.map(u => u.id) }
    }

    const registrations = await prisma.event_registrations.findMany({
      where,
      skip,
      take: perPageNum + 1,
      orderBy: { created_at: 'desc' },
    })

    const isLastPage = registrations.length <= perPageNum
    const data = isLastPage ? registrations : registrations.slice(0, perPageNum)

    const [users, events] = await Promise.all([
      prisma.users.findMany({
        where: { id: { in: data.map(r => r.user_id) } },
        select: { id: true, name: true, email: true },
      }),
      prisma.events.findMany({
        where: { id: { in: data.map(r => r.event_id) } },
        select: { id: true, code: true, title: true, start_at: true },
      }),
    ])

    const userMap = new Map(users.map(u => [u.id, u]))
    const eventMap = new Map(events.map(e => [e.id, e]))

    return {
      data: data.map(r => ({
        ...r,
        user: userMap.get(r.user_id) || null,
        event: eventMap.get(r.event_id) || null,
      })),
      pagination: { page: pageNum, perPage: perPageNum, isLastPage },
    }
  }
}
