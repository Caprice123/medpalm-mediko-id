export const MAX_EVIDENCE = 3

export const STATUS_LABEL = { pending: 'Menunggu', approved: 'Disetujui', rejected: 'Ditolak' }

export function getRegistrationStatus(webinar) {
  const now = new Date()
  if (webinar.registrationStartAt && new Date(webinar.registrationStartAt) > now) return 'upcoming'
  if (webinar.registrationEndAt && new Date(webinar.registrationEndAt) < now) return 'closed'
  return 'open'
}
