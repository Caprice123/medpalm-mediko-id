import prisma from '#prisma/client'
import attachmentService from '#services/attachment/attachmentService'

// How far ahead the landing page is willing to advertise an event whose
// registration has not opened yet.
const UPCOMING_WINDOW_DAYS = 7

export class GetEventsService {
  static async call({ page = 1, perPage = 20, search, registrationStatus, userId }) {
    const pageNum = parseInt(page)
    const perPageNum = parseInt(perPage)
    const skip = (pageNum - 1) * perPageNum
    const now = new Date()

    const where = { is_deleted: false, status: 'published' }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }
    if (registrationStatus === 'upcoming') {
      where.registration_start_at = { gt: now }
    } else if (registrationStatus === 'open') {
      where.registration_start_at = { lte: now }
      where.registration_end_at = { gte: now }
    } else if (registrationStatus === 'closed') {
      where.registration_end_at = { lt: now }
    } else if (registrationStatus === 'open_or_upcoming') {
      // Registration has not closed yet AND opens within the next week —
      // everything a visitor can either sign up for now or very soon. The
      // landing page asks for this; an event two months out is not news it
      // needs to carry.
      //
      // Both columns are nullable here, so each condition has to let a null
      // through: no deadline means registration never closes, and no opening
      // date means it is already open.
      const horizon = new Date(now.getTime() + UPCOMING_WINDOW_DAYS * 24 * 60 * 60 * 1000)
      where.AND = [
        { OR: [{ registration_end_at: null }, { registration_end_at: { gte: now } }] },
        { OR: [{ registration_start_at: null }, { registration_start_at: { lte: horizon } }] },
      ]
    }

    const events = await prisma.events.findMany({
      where,
      skip,
      take: perPageNum + 1,
      orderBy: { registration_start_at: 'asc' },
    })

    const isLastPage = events.length <= perPageNum
    const data = isLastPage ? events : events.slice(0, perPageNum)

    const [thumbnails, userRegistrations] = await Promise.all([
      Promise.all(data.map(e => attachmentService.getAttachmentWithUrl('event', e.id, 'thumbnail'))),
      userId
        ? prisma.event_registrations.findMany({
            where: { user_id: userId, event_id: { in: data.map(e => e.id) }, is_deleted: false },
            select: { event_id: true, status: true, created_at: true },
            orderBy: { created_at: 'desc' },
          })
        : [],
    ])

    // Latest registration status per event
    const latestByEventId = new Map()
    for (const reg of userRegistrations) {
      if (!latestByEventId.has(reg.event_id)) {
        latestByEventId.set(reg.event_id, reg.status)
      }
    }

    return {
      data: data.map((e, i) => ({
        ...e,
        thumbnail: thumbnails[i],
        myRegistrationStatus: latestByEventId.get(e.id) ?? null,
      })),
      pagination: { page: pageNum, perPage: perPageNum, isLastPage },
    }
  }
}
