import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class GetRubricsService extends BaseService {
  static async call({ name = '' } = {}) {
    // Build where clause
    const where = {}

    if (name && name.trim()) {
      where.name = {
        contains: name.trim(),
        mode: 'insensitive',
      }
    }

    // Fetch rubrics with pagination
    const [rubrics, totalCount] = await Promise.all([
      prisma.osce_rubrics.findMany({
        where,
        orderBy: {
          created_at: 'desc',
        },
      }),
      prisma.osce_rubrics.count({ where }),
    ])

    const totalPages = Math.ceil(totalCount / perPage)
    const hasMore = page < totalPages

    return {
      rubrics,
    }
  }
}
