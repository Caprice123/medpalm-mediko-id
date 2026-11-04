// Pure helpers for the Event V2 page. V1 spelled the same state machine out as
// a nested ternary in three components; it lives here once instead.

export const MAX_EVIDENCE = 5

export const CLAIM_STATUS_LABEL = {
  pending: 'Menunggu review',
  approved: 'Disetujui',
  rejected: 'Ditolak',
}

/**
 * Where the claim window sits relative to now. A null bound is unbounded on
 * that side: no opening date means already open, no deadline means never closes.
 * This matches the V2 backend filter.
 */
export function getClaimWindow(event) {
  const now = Date.now()
  if (event.registrationStartAt && new Date(event.registrationStartAt).getTime() > now) {
    return 'upcoming'
  }
  if (event.registrationEndAt && new Date(event.registrationEndAt).getTime() < now) {
    return 'closed'
  }
  return 'open'
}

/** True when the event never closes — both bounds absent, or no deadline. */
export function isEvergreen(event) {
  return !event.registrationEndAt
}

/**
 * How much of the claim window is left, for the depleting bar. Returns null
 * when either bound is missing: a bar drawn off a guessed window would be
 * decoration, so an evergreen event gets no bar at all.
 */
export function getClaimCountdown(event) {
  if (!event?.registrationStartAt || !event?.registrationEndAt) return null

  const start = new Date(event.registrationStartAt).getTime()
  const end = new Date(event.registrationEndAt).getTime()
  const now = Date.now()
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return null

  const remainingMs = end - now
  return {
    remainingRatio: Math.min(1, Math.max(0, remainingMs / (end - start))),
    daysLeft: Math.ceil(remainingMs / 86_400_000),
    isClosed: remainingMs <= 0,
    isUrgent: remainingMs > 0 && Math.ceil(remainingMs / 86_400_000) <= 3,
  }
}

export function deadlineLabel(countdown) {
  if (!countdown) return null
  if (countdown.daysLeft <= 0) return 'Tutup hari ini'
  if (countdown.daysLeft === 1) return 'Tutup besok'
  return `Tutup ${countdown.daysLeft} hari lagi`
}

/**
 * The one place that decides what the primary control says and does.
 * `kind`: claim | reclaim | pending | claimed | locked
 */
export function getClaimAction(event) {
  const window = getClaimWindow(event)

  if (event.myRegistrationStatus === 'approved') {
    return { kind: 'claimed', label: 'Sudah diklaim', disabled: true }
  }
  if (event.myRegistrationStatus === 'pending') {
    return { kind: 'pending', label: 'Menunggu review', disabled: true }
  }
  if (window === 'upcoming') {
    return { kind: 'locked', label: 'Belum dibuka', disabled: true }
  }
  if (window === 'closed') {
    return { kind: 'locked', label: 'Sudah ditutup', disabled: true }
  }
  if (event.myRegistrationStatus === 'rejected') {
    return { kind: 'reclaim', label: 'Klaim ulang', disabled: false }
  }
  return { kind: 'claim', label: 'Klaim', disabled: false }
}

/**
 * The reward, as the display needs it. In the live data this is always exactly
 * one feature for two days and never any credits — so `credits` is returned but
 * renders only when it is actually there, rather than leaving a hole in the card.
 *
 * `featureLabels` maps a feature key to its human name; it comes from the
 * feature list, which is served off the `constants` table.
 */
export function describeReward({ creditsOnApproval, creditType, creditExpiryDays, allowedFeatures }, featureLabels = {}) {
  const credits = creditsOnApproval > 0
    ? {
      amount: creditsOnApproval,
      qualifier: creditType === 'expiring' && creditExpiryDays
        ? `berlaku ${creditExpiryDays} hari`
        : 'permanen',
    }
    : null

  const features = (allowedFeatures || []).map(({ key, durationDays }) => ({
    key,
    name: featureLabels[key] || key,
    durationDays,
  }))

  return { credits, features, isEmpty: !credits && features.length === 0 }
}

/** What an approved claim actually disbursed — a separate field from the offer. */
export function describeGranted({ creditsGranted, featuresGranted }, featureLabels = {}) {
  const credits = creditsGranted > 0 ? creditsGranted : null
  const features = (featuresGranted || []).map(({ key, durationDays }) => ({
    key,
    name: featureLabels[key] || key,
    durationDays,
  }))
  return { credits, features, isEmpty: !credits && features.length === 0 }
}

/**
 * Whether a granted feature's access window has run out.
 *
 * Derived from `reviewedAt + durationDays`, since that is when the admin
 * disbursed it. The authoritative record lives in `user_feature_subscriptions`,
 * which this page does not read — so when `reviewedAt` is missing we return
 * null and the row says nothing about expiry rather than guessing.
 */
export function isGrantExpired(reviewedAt, durationDays) {
  if (!reviewedAt || !durationDays) return null
  const endsAt = new Date(reviewedAt).getTime() + durationDays * 86_400_000
  if (!Number.isFinite(endsAt)) return null
  return endsAt < Date.now()
}

/** Counts for the history track's heading. */
export function countClaimsByStatus(claims) {
  return claims.reduce(
    (acc, claim) => {
      if (acc[claim.status] !== undefined) acc[claim.status] += 1
      return acc
    },
    { pending: 0, approved: 0, rejected: 0 },
  )
}
