import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class GetListPricingPlansService extends BaseService {
  static async call(req) {
    const {
      page = 1,
      limit = 10,
      search_name,
      search_code,
      bundle_type
    } = req.query

    const where = {}

    // Filter by bundle type
    if (bundle_type && bundle_type !== 'all') {
      where.bundle_type = bundle_type
    }

    // Search by name
    if (search_name) {
      where.name = {
        contains: search_name,
        mode: 'insensitive'
      }
    }

    // Search by code
    if (search_code) {
      where.code = {
        contains: search_code,
        mode: 'insensitive'
      }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit)
    const take = parseInt(limit) + 1 // Fetch one extra to check if there's more

    const plans = await prisma.pricing_plans.findMany({
      where: where,
      orderBy: [
        { order: 'asc' },
        { id: 'desc' }
      ],
      skip,
      take
    })

    // Check if there are more pages
    const isLastPage = plans.length <= parseInt(limit)

    // Return only the requested number of items
    const data = isLastPage ? plans : plans.slice(0, parseInt(limit))

    return {
      data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        isLastPage
      }
    }
  }
}
