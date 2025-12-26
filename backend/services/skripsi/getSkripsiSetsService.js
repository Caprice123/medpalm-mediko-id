import prisma from '../../prisma/client.js'
import { BaseService } from '../baseService.js'

export class GetSkripsiSetsService extends BaseService {
  static async call({ userId, page = 1, perPage = 20 }) {
    const skip = (page - 1) * perPage

    const [sets, total] = await Promise.all([
      prisma.skripsi_sets.findMany({
        where: {
          user_id: userId,
          is_deleted: false
        },
        orderBy: {
          updated_at: 'desc'
        },
        skip,
        take: perPage
      }),
      prisma.skripsi_sets.count({
        where: {
          user_id: userId,
          is_deleted: false
        }
      })
    ])

    const totalPages = Math.ceil(total / perPage)
    const isLastPage = page >= totalPages

    return {
      data: sets,
      pagination: {
        page,
        perPage,
        total,
        totalPages,
        isLastPage
      }
    }
  }
}
