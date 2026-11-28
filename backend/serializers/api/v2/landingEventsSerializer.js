import { toJakartaISO } from '#utils/dateUtils'

export const serializeLandingEvent = (item) => ({
  kind: item.kind,
  ref: item.ref,
  title: item.title,
  description: item.description,
  registrationStartAt: toJakartaISO(item.registration_start_at),
  registrationEndAt: toJakartaISO(item.registration_end_at),
})

export const serializeLandingEvents = (items) => items.map(serializeLandingEvent)
