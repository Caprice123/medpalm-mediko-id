import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class GetCustomSessionsService extends BaseService {
  static async call({ userId }) {
    return prisma.user_review_custom_sessions.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
    })
  }
}
