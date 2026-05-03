import { CreateEventService } from '#services/event/admin/createEventService'
import { UpdateEventService } from '#services/event/admin/updateEventService'
import { DeleteEventService } from '#services/event/admin/deleteEventService'
import { GetEventsService } from '#services/event/admin/getEventsService'
import { GetEventDetailService } from '#services/event/admin/getEventDetailService'
import { GetRegistrationsService } from '#services/event/admin/getRegistrationsService'
import { GetAllRegistrationsService } from '#services/event/admin/getAllRegistrationsService'
import { GetRegistrationDetailService } from '#services/event/admin/getRegistrationDetailService'
import { ReviewRegistrationService } from '#services/event/admin/reviewRegistrationService'
import { EventSerializer } from '#serializers/admin/v1/eventSerializer'
import { EventRegistrationSerializer } from '#serializers/admin/v1/eventRegistrationSerializer'

class AdminEventController {
  async index(req, res) {
    const { page, perPage, status, search } = req.query
    const result = await GetEventsService.call({ page, perPage, status, search })
    return res.status(200).json({ data: EventSerializer.serializeList(result.data), pagination: result.pagination })
  }

  async create(req, res) {
    const { code, title, description, registrationStartAt, registrationEndAt, status, thumbnailBlobId, creditsOnApproval, creditType, creditExpiryDays, allowedFeatures } = req.body
    const event = await CreateEventService.call({ code, title, description, registrationStartAt, registrationEndAt, status, thumbnailBlobId, creditsOnApproval, creditType, creditExpiryDays, allowedFeatures, createdBy: req.user.id })
    return res.status(201).json({ data: EventSerializer.serialize(event) })
  }

  async show(req, res) {
    const { code } = req.params
    const event = await GetEventDetailService.call(code)
    return res.status(200).json({ data: EventSerializer.serialize(event) })
  }

  async update(req, res) {
    const { code } = req.params
    const { title, description, registrationStartAt, registrationEndAt, status, thumbnailBlobId, creditsOnApproval, creditType, creditExpiryDays, allowedFeatures } = req.body
    const event = await UpdateEventService.call({ code, title, description, registrationStartAt, registrationEndAt, status, thumbnailBlobId, creditsOnApproval, creditType, creditExpiryDays, allowedFeatures })
    return res.status(200).json({ data: EventSerializer.serialize(event) })
  }

  async delete(req, res) {
    const { code } = req.params
    await DeleteEventService.call(code)
    return res.status(200).json({ data: { success: true } })
  }

  async indexRegistrations(req, res) {
    const { page, perPage, status, search, eventId } = req.query
    const result = await GetAllRegistrationsService.call({ page, perPage, status, search, eventId })
    return res.status(200).json({ data: EventRegistrationSerializer.serializeList(result.data), pagination: result.pagination })
  }

  async listRegistrations(req, res) {
    const { code } = req.params
    const { page, perPage, status } = req.query
    const result = await GetRegistrationsService.call({ eventCode: code, page, perPage, status })
    return res.status(200).json({ data: EventRegistrationSerializer.serializeList(result.data), pagination: result.pagination })
  }

  async showRegistration(req, res) {
    const { registrationUniqueId } = req.params
    const registration = await GetRegistrationDetailService.call(registrationUniqueId)
    return res.status(200).json({ data: EventRegistrationSerializer.serialize(registration) })
  }

  async reviewRegistration(req, res) {
    const { registrationUniqueId } = req.params
    const { status, adminNotes } = req.body
    const registration = await ReviewRegistrationService.call({ uniqueId: registrationUniqueId, status, adminNotes, reviewerId: req.user.id })
    return res.status(200).json({ data: EventRegistrationSerializer.serialize(registration) })
  }
}

export default new AdminEventController()
