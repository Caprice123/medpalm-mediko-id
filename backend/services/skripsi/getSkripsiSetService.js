import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { NotFoundError } from '#errors/notFoundError'
import { V1_TAB_WHERE } from '#services/skripsi/skripsiTabsV1'

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
          // Only V1's own tabs: V2 stores its panels on the same report.
          where: V1_TAB_WHERE,
          orderBy: { id: 'asc' },
          include: includeMessages ? {
            messages: {
              orderBy: { id: 'desc' },
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
