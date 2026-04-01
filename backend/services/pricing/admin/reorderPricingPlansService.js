import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'

export class ReorderPricingPlansService extends BaseService {
  static async call(req) {
    const { orders } = req.body

    if (!Array.isArray(orders) || orders.length === 0) {
      throw new ValidationError('orders must be a non-empty array of { id, order }')
    }

    await prisma.$transaction(
      orders.map(({ id, order }) =>
        prisma.pricing_plans.update({
          where: { id: parseInt(id) },
          data: { order: parseInt(order), updated_at: new Date() },
        })
      )
    )
  }
}
