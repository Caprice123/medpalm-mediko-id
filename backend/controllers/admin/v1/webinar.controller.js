import { CreateWebinarService } from '#services/webinar/admin/createWebinarService'
import { UpdateWebinarService } from '#services/webinar/admin/updateWebinarService'
import { DeleteWebinarService } from '#services/webinar/admin/deleteWebinarService'
import { GetWebinarsService } from '#services/webinar/admin/getWebinarsService'
import { GetWebinarDetailService } from '#services/webinar/admin/getWebinarDetailService'
import { GetRegistrationsService } from '#services/webinar/admin/getRegistrationsService'
import { GetAllRegistrationsService } from '#services/webinar/admin/getAllRegistrationsService'
import { ReviewRegistrationService } from '#services/webinar/admin/reviewRegistrationService'
import { WebinarSerializer } from '#serializers/admin/v1/webinarSerializer'
import { WebinarRegistrationSerializer } from '#serializers/admin/v1/webinarRegistrationSerializer'

class AdminWebinarController {
  async index(req, res) {
    const { page, perPage, status, search } = req.query

    const result = await GetWebinarsService.call({ page, perPage, status, search })

    return res.status(200).json({
      data: WebinarSerializer.serializeList(result.data),
      pagination: result.pagination,
    })
  }

  async create(req, res) {
    const { title, description, speakers, benefits, suitableFor, joinUrl, startAt, endAt, status, thumbnailBlobId } = req.body

    const webinar = await CreateWebinarService.call({
      title,
      description,
      speakers,
      benefits,
      suitableFor,
      joinUrl,
      startAt,
      endAt,
      status,
      thumbnailBlobId,
      createdBy: req.user.id,
    })

    return res.status(201).json({ data: WebinarSerializer.serialize(webinar) })
  }

  async show(req, res) {
    const { uniqueId } = req.params

    const webinar = await GetWebinarDetailService.call(uniqueId)

    return res.status(200).json({ data: WebinarSerializer.serialize(webinar) })
  }

  async update(req, res) {
    const { uniqueId } = req.params
    const { title, description, speakers, benefits, suitableFor, joinUrl, startAt, endAt, status, thumbnailBlobId } = req.body

    const webinar = await UpdateWebinarService.call({
      uniqueId,
      title,
      description,
      speakers,
      benefits,
      suitableFor,
      joinUrl,
      startAt,
      endAt,
      status,
      thumbnailBlobId,
    })

    return res.status(200).json({ data: WebinarSerializer.serialize(webinar) })
  }

  async delete(req, res) {
    const { uniqueId } = req.params

    await DeleteWebinarService.call(uniqueId)

    return res.status(200).json({ data: { success: true } })
  }

  async indexRegistrations(req, res) {
    const { page, perPage, status, search, webinarId } = req.query

    const result = await GetAllRegistrationsService.call({ page, perPage, status, search, webinarId })

    return res.status(200).json({
      data: WebinarRegistrationSerializer.serializeList(result.data),
      pagination: result.pagination,
    })
  }

  async listRegistrations(req, res) {
    const { uniqueId } = req.params
    const { page, perPage, status } = req.query

    const result = await GetRegistrationsService.call({
      webinarUniqueId: uniqueId,
      page,
      perPage,
      status,
    })

    return res.status(200).json({
      data: WebinarRegistrationSerializer.serializeList(result.data),
      pagination: result.pagination,
    })
  }

  async reviewRegistration(req, res) {
    const { registrationUniqueId } = req.params
    const { status, adminNotes } = req.body

    const registration = await ReviewRegistrationService.call({
      uniqueId: registrationUniqueId,
      status,
      adminNotes,
      reviewerId: req.user.id,
    })

    return res.status(200).json({ data: WebinarRegistrationSerializer.serialize(registration) })
  }
}

export default new AdminWebinarController()
