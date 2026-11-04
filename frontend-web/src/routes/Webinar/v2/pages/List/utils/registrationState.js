// Pure helpers. V1 spelled the same state machine out as a nested ternary in
// three separate components (card footer, detail modal footer, my-registrations
// badge), so the three could and did drift. Everything that reads a webinar's
// registration state goes through here instead.

export const MAX_EVIDENCE = 3

export const REGISTRATION_STATUS_LABEL = {
  pending: 'Menunggu review',
  approved: 'Disetujui',
  rejected: 'Ditolak',
}

/** Where the webinar's *registration window* sits relative to now. */
export function getRegistrationWindow(webinar) {
  const now = Date.now()
  if (webinar.registrationStartAt && new Date(webinar.registrationStartAt).getTime() > now) {
    return 'upcoming'
  }
  if (webinar.registrationEndAt && new Date(webinar.registrationEndAt).getTime() < now) {
    return 'closed'
  }
  return 'open'
}

/**
 * How much of the registration window is left, for the billboard's deadline bar.
 * Returns null when either bound is missing — a bar drawn off a guessed window
 * would be decoration, and the craft floor has no room for that.
 */
export function getRegistrationCountdown(webinar) {
  if (!webinar?.registrationStartAt || !webinar?.registrationEndAt) return null

  const start = new Date(webinar.registrationStartAt).getTime()
  const end = new Date(webinar.registrationEndAt).getTime()
  const now = Date.now()
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return null

  const remainingMs = end - now
  const remainingRatio = Math.min(1, Math.max(0, remainingMs / (end - start)))
  const daysLeft = Math.ceil(remainingMs / 86_400_000)

  return {
    remainingRatio,
    daysLeft,
    isClosed: remainingMs <= 0,
    // Under three days the bar and its label turn amber.
    isUrgent: remainingMs > 0 && daysLeft <= 3,
  }
}

/**
 * The one place that decides what the primary control says and does.
 * `kind` lets a caller branch without re-reading the status fields:
 *   register | reapply | pending | registered | locked
 * `label` is the billboard's and modal's full wording; `shortLabel` is what a
 * half-width card footer can actually hold without truncating.
 */
export function getWebinarAction(webinar) {
  const window = getRegistrationWindow(webinar)

  if (webinar.myRegistrationStatus === 'approved') {
    return { kind: 'registered', label: 'Kamu sudah terdaftar', shortLabel: 'Terdaftar', disabled: true }
  }
  if (webinar.myRegistrationStatus === 'pending') {
    return { kind: 'pending', label: 'Menunggu review admin', shortLabel: 'Menunggu', disabled: true }
  }
  if (window === 'upcoming') {
    return { kind: 'locked', label: 'Pendaftaran belum dibuka', shortLabel: 'Belum dibuka', disabled: true }
  }
  if (window === 'closed') {
    return { kind: 'locked', label: 'Pendaftaran sudah ditutup', shortLabel: 'Ditutup', disabled: true }
  }
  if (webinar.myRegistrationStatus === 'rejected') {
    return { kind: 'reapply', label: 'Daftar ulang', shortLabel: 'Daftar ulang', disabled: false }
  }
  return { kind: 'register', label: 'Daftar webinar ini', shortLabel: 'Daftar', disabled: false }
}

/** Counts for the status band's chips. */
export function countRegistrationsByStatus(registrations) {
  return registrations.reduce(
    (acc, reg) => {
      if (acc[reg.status] !== undefined) acc[reg.status] += 1
      return acc
    },
    { pending: 0, approved: 0, rejected: 0 },
  )
}

/**
 * The approved registration whose webinar starts soonest and has not finished —
 * the join link the band offers directly.
 */
export function findNextJoinable(registrations) {
  const now = Date.now()
  return (
    registrations
      .filter(reg => reg.status === 'approved' && reg.webinar?.joinUrl?.length > 0)
      .filter(reg => {
        const ends = reg.webinar?.endAt || reg.webinar?.startAt
        return ends ? new Date(ends).getTime() >= now : true
      })
      .sort((a, b) => new Date(a.webinar?.startAt || 0) - new Date(b.webinar?.startAt || 0))[0] ?? null
  )
}

const FILTER_NOUN = {
  open: 'webinar sedang membuka pendaftaran',
  upcoming: 'webinar belum membuka pendaftaran',
  closed: 'webinar sudah selesai',
  all: 'webinar terjadwal',
}

/**
 * The page's count line. The API returns `isLastPage` and never a total, so this
 * counts what is actually loaded and marks it "+" when more pages exist — it
 * never states a total it cannot know.
 */
export function describeWebinarList({ loadedCount, isLastPage, registrationStatus }) {
  if (loadedCount === 0) return 'Belum ada webinar untuk filter ini'
  const noun = FILTER_NOUN[registrationStatus] ?? FILTER_NOUN.all
  return `${isLastPage ? loadedCount : `${loadedCount}+`} ${noun}`
}
