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
    const rubrics = await Promise.all([
      prisma.osce_rubrics.findMany({
        where,
        orderBy: {
          created_at: 'desc',
        },
      }),
    ])

    return {
      rubrics,
    }
  }
}
