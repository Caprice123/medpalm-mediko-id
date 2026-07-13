import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class ToggleFavoriteService extends BaseService {
  static async call({ userId, recordType, recordId }) {
    const existing = await prisma.user_favorites.findUnique({
      where: { user_id_record_type_record_id: { user_id: userId, record_type: recordType, record_id: parseInt(recordId) } }
    })

    if (existing) {
      await prisma.user_favorites.delete({ where: { id: existing.id } })
      return { isFavorited: false }
    }

    await prisma.user_favorites.create({
      data: { user_id: userId, record_type: recordType, record_id: parseInt(recordId) }
    })
    return { isFavorited: true }
  }
}
