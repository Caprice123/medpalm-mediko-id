import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { NotFoundError } from '#errors/notFoundError'

export class GetSkripsiSetService extends BaseService {
  static async call({ setId, userId, includeMessages = true, messageLimit = 50 }) {
    const set = await prisma.skripsi_sets.findFirst({
      where: {
        unique_id: setId,
        user_id: userId,
        is_deleted: false
      },
      include: {
        tabs: {
          orderBy: { id: 'asc' },
          include: includeMessages ? {
            messages: {
              orderBy: { created_at: 'desc' },
              take: messageLimit
            }
          } : undefined
        }
      }
    })

    if (!set) {
      throw new NotFoundError('Skripsi set not found')
    }

    return set
  }
}
