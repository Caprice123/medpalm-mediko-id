import { useSelector } from 'react-redux'
import { formatJakartaDateLong } from '@utils/dateUtils'
import { EventRoute } from '../../../../Event/routes'
import { WebinarRoute } from '../../../../Webinar/routes'
import { countdownLabel } from '../../../utils/countdown'

// Shapes the landing event list into the fields the card renders.
//
// The list comes from GET /api/v2/home/landing-events, which the landing page
// can read without a login. It holds free events and webinars at once, already
// merged and sorted by when registration opens, so the only thing left to do
// here is label them: `kindLabel` says which is which, and `status` carries the
// countdown for the ones whose registration is not open yet.
//
// The item's own start date is not in the payload — the serializer exposes only
// the registration window — so the date badge shows that window, which is the
// date a visitor can act on anyway.
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
    const isWebinar = event.kind === 'webinar'

    return {
      code: `${event.kind}-${event.ref}`,
      kind: event.kind,
      kindLabel: isWebinar ? 'Webinar' : 'Free Event',
      href: isWebinar ? WebinarRoute.moduleRoute : EventRoute.moduleRoute,
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
