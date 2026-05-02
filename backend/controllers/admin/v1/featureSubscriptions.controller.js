import { ListFeatureSubscriptionsService } from '#services/users/listFeatureSubscriptionsService'
import { CreateFeatureSubscriptionService } from '#services/users/createFeatureSubscriptionService'
import { UpdateFeatureSubscriptionByIdService } from '#services/users/updateFeatureSubscriptionByIdService'
import { ValidationUtils } from '#utils/validationUtils'

class FeatureSubscriptionsController {
  async index(req, res) {
    const { feature, userId, isActive, search, page, perPage } = req.query
    const result = await ListFeatureSubscriptionsService.call({ feature, userId, isActive, search, page, perPage })
    res.status(200).json({ data: result })
  }

  async create(req, res) {
    ValidationUtils.validate_fields({
      request: req,
      requiredFields: ['userId', 'feature'],
      optionalFields: ['startDate', 'endDate'],
    })
    const { userId, feature, startDate, endDate } = req.body
    const item = await CreateFeatureSubscriptionService.call({
      userId: parseInt(userId),
      feature,
      startDate: startDate || null,
      endDate: endDate || null,
    })
    res.status(200).json({ data: item })
  }

  async update(req, res) {
    const id = parseInt(req.params.id)
    const { startDate, endDate } = req.body
    const item = await UpdateFeatureSubscriptionByIdService.call(id, { startDate, endDate })
    res.status(200).json({ data: item })
  }
}

export default new FeatureSubscriptionsController()
