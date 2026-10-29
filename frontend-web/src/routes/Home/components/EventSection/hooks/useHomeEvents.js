import { useSelector } from 'react-redux'
import { formatJakartaDateLong } from '@utils/dateUtils'
import { countdownLabel } from '../../../utils/countdown'

// Shapes the event listing into the fields the card renders.
//
// The list comes from GET /api/v1/events, which the landing page can read
// without a login. It holds two kinds of event at once: registration already
// open, and registration opening within the next week. The badge is what tells
// them apart, so it carries the countdown for the ones not open yet.
//
// The event's own start date is not in the payload — the serializer exposes
// only the registration window — so the date badge shows that window, which is
// the date a visitor can act on anyway.
export function useHomeEvents() {
  const events = useSelector((state) => state.home.events)

  // null means the request has not resolved; an empty array means there really
  // are no events worth listing, which is the only case that earns the empty
  // state.
  const isLoaded = Array.isArray(events)
  const now = Date.now()

  const items = (events || []).map((event) => {
    const opensAt = event.registrationStartAt
    const isUpcoming = Boolean(opensAt) && new Date(opensAt).getTime() > now

    return {
      code: event.code,
      title: event.title,
      description: event.description,
      status: isUpcoming ? `Buka ${countdownLabel(opensAt)}` : 'Pendaftaran Dibuka',
      date: isUpcoming
        ? formatJakartaDateLong(opensAt)
        : event.registrationEndAt
          ? `s/d ${formatJakartaDateLong(event.registrationEndAt)}`
          : 'Tanpa Batas Waktu',
    }
  })

  return { items, isLoaded }
}
