import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class TrackRecentlyViewedService extends BaseService {
  static async call({ userId, recordType, recordId, metadata = {} }) {
    await prisma.user_recently_viewed.upsert({
      where: {
        user_id_record_type_record_id: { user_id: userId, record_type: recordType, record_id: recordId }
      },
      create: { user_id: userId, record_type: recordType, record_id: recordId, metadata, viewed_at: new Date() },
      update: { viewed_at: new Date(), metadata }
    })
  }
}
