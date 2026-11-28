import prisma from '#prisma/client'

// How far ahead the landing page is willing to advertise something whose
// registration has not opened yet. Mirrors V1's event list window.
const UPCOMING_WINDOW_DAYS = 7

// Free events and webinars in one list for the landing page, sorted by when
// registration opens.
//
// The two queries stay separate (no join, no raw SQL) and are merged in memory,
// which the 7-day window keeps tiny. They cannot share a `where`: `events`
// declares both registration columns nullable while `webinar_events` requires
// them, and Prisma rejects a `null` match or a `nulls` ordering on a required
// field. So the window is expressed twice — once with the null branches, once
// without.
export class GetLandingEventsV2Service {
  static async call({ limit = 3 } = {}) {
    const now = new Date()
    const horizon = new Date(now.getTime() + UPCOMING_WINDOW_DAYS * 24 * 60 * 60 * 1000)
    const take = parseInt(limit)

    const published = { is_deleted: false, status: 'published' }
    const select = {
      title: true,
      description: true,
      registration_start_at: true,
      registration_end_at: true,
    }

    const [events, webinars] = await Promise.all([
      // Registration has not closed yet AND opens within the next week. Both
      // columns are nullable here, so each condition has to let a null
      // through: no deadline means registration never closes, and no opening
      // date means it is already open.
      prisma.events.findMany({
        where: {
          ...published,
          AND: [
            { OR: [{ registration_end_at: null }, { registration_end_at: { gte: now } }] },
            { OR: [{ registration_start_at: null }, { registration_start_at: { lte: horizon } }] },
          ],
        },
        select: { ...select, code: true },
        // Nulls first so an always-open event is never the one `take` cuts — it
        // is the most relevant, not the least.
        orderBy: [{ registration_start_at: { sort: 'asc', nulls: 'first' } }],
        take,
      }),
      // Same window, but a webinar always has both dates, so there is no null
      // to allow for on either side.
      prisma.webinar_events.findMany({
        where: {
          ...published,
          registration_end_at: { gte: now },
          registration_start_at: { lte: horizon },
        },
        select: { ...select, unique_id: true },
        orderBy: [{ registration_start_at: 'asc' }],
        take,
      }),
    ])

    const opensAt = (row) =>
      row.registration_start_at ? new Date(row.registration_start_at).getTime() : 0

    return [
      ...events.map((e) => ({ ...e, kind: 'event', ref: e.code })),
      ...webinars.map((w) => ({ ...w, kind: 'webinar', ref: w.unique_id })),
    ]
      .sort((a, b) => opensAt(a) - opensAt(b))
      .slice(0, take)
  }
}
