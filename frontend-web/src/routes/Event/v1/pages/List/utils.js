export const MAX_EVIDENCE = 5

export const STATUS_LABEL = { pending: 'Menunggu Review', approved: 'Disetujui', rejected: 'Ditolak' }

export function getRegistrationStatus(event) {
  const now = new Date()
  if (!event.registrationStartAt && !event.registrationEndAt) return 'open'
  if (event.registrationStartAt && new Date(event.registrationStartAt) > now) return 'upcoming'
  if (event.registrationEndAt && new Date(event.registrationEndAt) < now) return 'closed'
  return 'open'
}
