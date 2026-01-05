import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class GetSkripsiSetsService extends BaseService {
  static async call({ userId, page = 1, perPage = 20 }) {
    const skip = (page - 1) * perPage

    const sets = await prisma.skripsi_sets.findMany({
      where: {
        user_id: userId,
        is_deleted: false
      },
      orderBy: {
        updated_at: 'desc'
      },
      skip,
      take: perPage + 1
    })

    const isLastPage = sets.length <= perPage

    return {
      data: sets,
      pagination: {
        page,
        perPage,
        isLastPage
      }
    }
  }
}
