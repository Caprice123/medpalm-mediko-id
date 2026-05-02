import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'

export class ReorderBannersService {
  static async call({ orders }) {
    if (!Array.isArray(orders) || orders.length === 0) {
      throw new ValidationError('orders must be a non-empty array of { id, order }')
    }

    await prisma.$transaction(
      orders.map(({ id, order }) =>
        prisma.banners.update({
          where: { id: parseInt(id) },
          data: { order: parseInt(order), updated_at: new Date() },
        })
      )
    )
  }
}
