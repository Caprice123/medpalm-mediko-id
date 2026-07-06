import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class UpdateProfileService extends BaseService {
  static async call(userId, { phoneNumber, university }) {
    return prisma.user_profiles.upsert({
      where: { user_id: userId },
      update: {
        phone_number: phoneNumber,
        university: university,
        is_complete: true,
        updated_at: new Date(),
      },
      create: {
        user_id: userId,
        phone_number: phoneNumber,
        university: university,
        is_complete: true,
      },
    })
  }
}
