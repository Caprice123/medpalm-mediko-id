import { GetWebinarsService } from '#services/webinar/getWebinarsService'
import { GetWebinarDetailService } from '#services/webinar/getWebinarDetailService'
import { RegisterWebinarService } from '#services/webinar/registerWebinarService'
import { GetMyRegistrationsService } from '#services/webinar/getMyRegistrationsService'
import { WebinarSerializer } from '#serializers/api/v1/webinarSerializer'
import { WebinarRegistrationSerializer } from '#serializers/api/v1/webinarRegistrationSerializer'

class WebinarController {
  async index(req, res) {
    const { page, perPage, search, registrationStatus } = req.query

    const result = await GetWebinarsService.call({ page, perPage, search, registrationStatus, userId: req.user.id })

    return res.status(200).json({
      data: WebinarSerializer.serializeList(result.data),
      pagination: result.pagination,
    })
  }

  async show(req, res) {
    const { uniqueId } = req.params

    const webinar = await GetWebinarDetailService.call(uniqueId)

    return res.status(200).json({ data: WebinarSerializer.serialize(webinar) })
  }

  async register(req, res) {
    const { uniqueId } = req.params

    const registration = await RegisterWebinarService.call({
      webinarUniqueId: uniqueId,
      userId: req.user.id,
    })

    return res.status(201).json({ data: WebinarRegistrationSerializer.serialize(registration) })
  }

  async myRegistrations(req, res) {
    const { page, perPage } = req.query

    const result = await GetMyRegistrationsService.call({
      userId: req.user.id,
      page,
      perPage,
    })

    return res.status(200).json({
      data: WebinarRegistrationSerializer.serializeList(result.data),
      pagination: result.pagination,
    })
  }
}

export default new WebinarController()
