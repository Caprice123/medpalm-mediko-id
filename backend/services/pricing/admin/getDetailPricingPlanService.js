import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'

export class GetDetailPricingPlanService extends BaseService {
  static async call(id) {
    const plan = await prisma.pricing_plans.findUnique({
      where: { id: parseInt(id) },
    })

    if (!plan) {
      throw new ValidationError('Pricing plan not found')
    }

    return plan
  }
}
