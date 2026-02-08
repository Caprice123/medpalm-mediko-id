import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { NotFoundError } from '#errors/notFoundError'
import { SkripsiMessageSerializer } from '#serializers/api/v1/skripsiMessageSerializer'

export class GetTabMessagesService extends BaseService {
  static async call({ tabId, userId, limit = 50, beforeMessageId = null }) {
    // First verify the tab belongs to the user
    const tab = await prisma.skripsi_tabs.findFirst({
      where: {
        id: tabId,
        skripsi_set: {
          user_id: userId,
          is_deleted: false
        }
      }
    })

    if (!tab) {
      throw new NotFoundError('Tab not found')
    }

    // Build where clause for pagination
    const where = {
      tab_id: tabId
    }

    if (beforeMessageId) {
      where.id = { lt: beforeMessageId }
    }

    // Fetch messages (newest first, then reverse)
    const messages = await prisma.skripsi_messages.findMany({
      where,
      orderBy: { created_at: 'desc' },
      take: limit,
      include: {
        skripsi_message_sources: true
      }
    })

    // Reverse to show oldest first
    messages.reverse()

    return {
      messages: SkripsiMessageSerializer.serialize(messages),
      hasMore: messages.length === limit
    }
  }
}
