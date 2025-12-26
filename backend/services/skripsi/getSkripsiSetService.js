import prisma from '../../prisma/client.js'
import { BaseService } from '../baseService.js'
import { NotFoundError } from '../../errors/notFoundError.js'

export class GetSkripsiSetService extends BaseService {
  static async call({ setId, userId, includeMessages = true, messageLimit = 50 }) {
    const set = await prisma.skripsi_sets.findFirst({
      where: {
        id: setId,
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

    // Reverse messages to show oldest first (since we fetched newest first with limit)
    if (includeMessages && set.tabs) {
      set.tabs.forEach(tab => {
        if (tab.messages) {
          tab.messages.reverse()
        }
      })
    }

    return set
  }
}
