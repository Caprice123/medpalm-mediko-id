import { GetEventsService } from '#services/event/user/getEventsService'
import { RegisterEventService } from '#services/event/user/registerEventService'
import { GetMyRegistrationsService } from '#services/event/user/getMyRegistrationsService'
import { EventSerializer } from '#serializers/api/v1/eventSerializer'
import { EventRegistrationSerializer } from '#serializers/api/v1/eventRegistrationSerializer'

// Whitelist rather than a blacklist: a field added to the serializer later
// should stay private until someone decides it is public.
const PUBLIC_EVENT_FIELDS = (event) => ({
  code: event.code,
  title: event.title,
  description: event.description,
  registrationStartAt: event.registrationStartAt,
  registrationEndAt: event.registrationEndAt,
  status: event.status,
  thumbnail: event.thumbnail,
})

class EventController {
  async index(req, res) {
    const { page, perPage, search, registrationStatus } = req.query

    // This route is readable without a login (the public landing page), so
    // there may be no user. `?? null` rather than leaving it undefined: the
    // service passes the value straight into a Prisma `where`, and Prisma drops
    // an undefined filter, which would match every user's registrations.
    const userId = req.user?.id ?? null

    const result = await GetEventsService.call({ page, perPage, search, registrationStatus, userId })
    const events = EventSerializer.serializeList(result.data)

    return res.status(200).json({
      // An anonymous caller gets only what the landing card renders. The credit
      // grant and feature unlocks an event hands out are provisioning details
      // for a registered participant, not something to publish to a visitor.
      data: userId ? events : events.map(PUBLIC_EVENT_FIELDS),
      pagination: result.pagination,
    })
  }

  async register(req, res) {
    const { code } = req.params
    const { blobIds } = req.body
    const registration = await RegisterEventService.call({ eventCode: code, userId: req.user.id, blobIds })
    return res.status(201).json({ data: EventRegistrationSerializer.serialize(registration) })
  }

  async myRegistrations(req, res) {
    const { page, perPage } = req.query
    const result = await GetMyRegistrationsService.call({ userId: req.user.id, page, perPage })
    return res.status(200).json({
      data: EventRegistrationSerializer.serializeList(result.data),
      pagination: result.pagination,
    })
  }
}

export default new EventController()
