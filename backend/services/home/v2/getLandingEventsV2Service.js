import prisma from '#prisma/client'

// How far ahead the landing page is willing to advertise something whose
// registration has not opened yet. Mirrors V1's event list window.
const UPCOMING_WINDOW_DAYS = 7

// Free events and webinars in one list for the landing page, sorted by when
// registration opens.
//
// Both tables carry the same registration-window columns, so the filter and the
// sort are shared and only `kind` tells a card which page to link to. The two
// queries stay separate (no join, no raw SQL) and are merged in memory, which
// `limit` keeps tiny.
export class GetLandingEventsV2Service {
  static async call({ limit = 3 } = {}) {
    const now = new Date()
    const horizon = new Date(now.getTime() + UPCOMING_WINDOW_DAYS * 24 * 60 * 60 * 1000)
    const take = parseInt(limit)

    // Registration has not closed yet AND opens within the next week. Both
    // columns are nullable, so each condition has to let a null through: no
    // deadline means registration never closes, and no opening date means it is
    // already open.
    const where = {
      is_deleted: false,
      status: 'published',
      AND: [
        { OR: [{ registration_end_at: null }, { registration_end_at: { gte: now } }] },
        { OR: [{ registration_start_at: null }, { registration_start_at: { lte: horizon } }] },
      ],
    }
    const select = {
      title: true,
      description: true,
      registration_start_at: true,
      registration_end_at: true,
    }
    // Nulls first so an always-open row is never the one `take` cuts — it is
    // the most relevant, not the least.
    const orderBy = [{ registration_start_at: { sort: 'asc', nulls: 'first' } }]

    const [events, webinars] = await Promise.all([
      prisma.events.findMany({ where, select: { ...select, code: true }, orderBy, take }),
      prisma.webinar_events.findMany({ where, select: { ...select, unique_id: true }, orderBy, take }),
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
