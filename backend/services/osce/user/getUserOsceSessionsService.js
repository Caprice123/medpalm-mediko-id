import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class GetUserOsceSessionsService extends BaseService {
  static async call(userId, filters = {}) {
    if (!userId) {
      throw new Error('User ID is required')
    }

    try {
      // Pagination
      const page = parseInt(filters.page) || 1
      const perPage = parseInt(filters.perPage) || 20
      const skip = (page - 1) * perPage

      const sessions = await prisma.osce_sessions.findMany({
        skip,
        take: perPage,
        where: {
          user_id: userId,
        },
        include: {
          osce_session_topic_snapshot: true,
          osce_session_tag_snapshots: {
            include: {
                tags: {
                    include: {
                        tag_group: true,
                    }
                }
            }
          }
        },
        orderBy: {
          created_at: 'desc',
        },
      })

      return {
        sessions,
        pagination: {
          page,
          perPage,
          isLastPage: sessions.length < perPage
        }
      }
    } catch (error) {
      console.error('[GetUserOsceSessionsService] Error:', error)
      throw new Error('Failed to fetch user OSCE sessions')
    }
  }
}
