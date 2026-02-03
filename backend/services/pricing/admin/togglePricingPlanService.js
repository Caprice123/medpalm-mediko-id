import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'

export class TogglePricingPlanService extends BaseService {
  static async call(id, req) {
    const plan = await prisma.pricing_plans.findUnique({
      where: { id: parseInt(id) }
    })

    if (!plan) {
      throw new ValidationError('Pricing plan not found')
    }

    const updatedPlan = await prisma.pricing_plans.update({
      where: { id: parseInt(id) },
      data: {
        is_active: !plan.is_active,
        updated_at: new Date()
      }
    })

    return updatedPlan
  }
}
