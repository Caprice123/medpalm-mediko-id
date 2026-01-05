import { GetListPricingPlansService } from '#services/pricing/admin/getListPricingPlansService'
import { GetDetailPricingPlanService } from '#services/pricing/admin/getDetailPricingPlanService'
import { CreatePricingPlanService } from '#services/pricing/admin/createPricingPlanService'
import { UpdatePricingPlanService } from '#services/pricing/admin/updatePricingPlanService'
import { TogglePricingPlanService } from '#services/pricing/admin/togglePricingPlanService'
import { GetPurchaseDetailService } from '#services/pricing/admin/getPurchaseDetailService'
import { ApprovePurchaseService } from '#services/pricing/admin/approvePurchaseService'

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

  async getPurchaseDetail(req, res) {
    const { id } = req.params
    const purchase = await GetPurchaseDetailService.call(id)

    if (purchase.error) {
      return res.status(purchase.statusCode || 404).json({
        error: purchase.error
      })
    }

    res.status(200).json({
      data: purchase
    })
  }

  async approvePurchase(req, res) {
    const { id } = req.params
    const { status } = req.body

    if (!status) {
      return res.status(400).json({
        error: 'Status is required (completed or failed)'
      })
    }

    await ApprovePurchaseService.call(id, status)

    res.status(200).json({
      message: {
        success: true
      }
    })
  }
}

export default new PricingPlanController()
