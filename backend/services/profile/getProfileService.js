import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class GetProfileService extends BaseService {
  static async call(userId) {
    return prisma.user_profiles.findUnique({
      where: { user_id: userId }
    })
  }
}
