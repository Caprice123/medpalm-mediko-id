import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'

export class GetRecentlyViewedService extends BaseService {
  static async call({ userId, recordType, limit = 5 }) {
    if (!recordType) throw new ValidationError('recordType wajib diisi')

    const records = await prisma.user_recently_viewed.findMany({
      where: { user_id: userId, record_type: recordType },
      orderBy: { viewed_at: 'desc' },
      take: parseInt(limit) || 5
    })

    return records
  }
}
