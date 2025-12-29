import { GetListPricingPlansService } from '#services/pricing/admin/getListPricingPlansService'
import { GetDetailPricingPlanService } from '#services/pricing/admin/getDetailPricingPlanService'
import { CreatePricingPlanService } from '#services/pricing/admin/createPricingPlanService'
import { UpdatePricingPlanService } from '#services/pricing/admin/updatePricingPlanService'
import { TogglePricingPlanService } from '#services/pricing/admin/togglePricingPlanService'

class PricingPlanController {
  async index(req, res) {
    const result = await GetListPricingPlansService.call(req)

    res.status(200).json({
      data: result.data,
      pagination: result.pagination
    })
  }

  async show(req, res) {
    const { id } = req.params
    const plan = await GetDetailPricingPlanService.call(id)

    res.status(200).json({
      data: plan
    })
  }

  async create(req, res) {
    const plan = await CreatePricingPlanService.call(req)

    res.status(201).json({
      data: plan,
    })
  }

  async update(req, res) {
    const { id } = req.params
    const plan = await UpdatePricingPlanService.call(id, req)

    res.status(200).json({
      data: plan,
    })
  }

  async toggle(req, res) {
    const { id } = req.params
    const plan = await TogglePricingPlanService.call(id, req)

    res.status(200).json({
      data: plan,
    })
  }
}

export default new PricingPlanController()
