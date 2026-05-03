import { GetEventsService } from '#services/event/user/getEventsService'
import { RegisterEventService } from '#services/event/user/registerEventService'
import { GetMyRegistrationsService } from '#services/event/user/getMyRegistrationsService'
import { EventSerializer } from '#serializers/api/v1/eventSerializer'
import { EventRegistrationSerializer } from '#serializers/api/v1/eventRegistrationSerializer'

class EventController {
  async index(req, res) {
    const { page, perPage, search, registrationStatus } = req.query
    const result = await GetEventsService.call({ page, perPage, search, registrationStatus, userId: req.user.id })
    return res.status(200).json({
      data: EventSerializer.serializeList(result.data),
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
