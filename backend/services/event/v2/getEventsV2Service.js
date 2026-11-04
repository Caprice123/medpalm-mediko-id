import prisma from '#prisma/client'
import attachmentService from '#services/attachment/attachmentService'

/**
 * V2 of the user-facing event list.
 *
 * Why this exists rather than reusing V1's `registrationStatus` filter: both
 * `registration_start_at` and `registration_end_at` are nullable, and V1's
 * `open` branch requires both to be set —
 *
 *   where.registration_start_at = { lte: now }
 *   where.registration_end_at   = { gte: now }
 *
 * — so an event with no claim window never matches it, even though the frontend's
 * own `getRegistrationStatus()` treats a window-less event as open. An admin
 * creating an always-claimable event would watch it vanish from the default tab.
 * Every branch below lets the relevant null through instead.
 *
 * V1's service, controller and route are untouched; the landing page still reads
 * them, including its own `open_or_upcoming` branch.
 */
export class GetEventsV2Service {
  static async call({ page = 1, perPage = 20, search, claimState = 'all', userId }) {
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

    // A null bound means "unbounded on that side": no opening date means it is
    // already open, no deadline means it never closes.
    if (claimState === 'open') {
      where.AND = [
        { OR: [{ registration_start_at: null }, { registration_start_at: { lte: now } }] },
        { OR: [{ registration_end_at: null }, { registration_end_at: { gte: now } }] },
      ]
    } else if (claimState === 'upcoming') {
      where.registration_start_at = { gt: now }
    } else if (claimState === 'closed') {
      where.registration_end_at = { lt: now }
    }

    const events = await prisma.events.findMany({
      where,
      skip,
      take: perPageNum + 1,
      // Soonest deadline first for an open list, so what is about to close leads.
      // Nulls sort last, which is right: an event that never closes is not urgent.
      orderBy: claimState === 'open'
        ? [{ registration_end_at: 'asc' }, { created_at: 'desc' }]
        : [{ registration_start_at: 'desc' }],
    })

    const isLastPage = events.length <= perPageNum
    const data = isLastPage ? events : events.slice(0, perPageNum)

    const [thumbnails, userRegistrations] = await Promise.all([
      Promise.all(data.map(e => attachmentService.getAttachmentWithUrl('event', e.id, 'thumbnail'))),
      userId
        ? prisma.event_registrations.findMany({
            where: { user_id: userId, event_id: { in: data.map(e => e.id) }, is_deleted: false },
            select: { event_id: true, status: true },
          })
        : [],
    ])

    const registrationByEventId = new Map(userRegistrations.map(r => [r.event_id, r.status]))

    return {
      data: data.map((e, i) => ({
        ...e,
        thumbnail: thumbnails[i],
        myRegistrationStatus: registrationByEventId.get(e.id) ?? null,
      })),
      pagination: { page: pageNum, perPage: perPageNum, isLastPage },
    }
  }
}
