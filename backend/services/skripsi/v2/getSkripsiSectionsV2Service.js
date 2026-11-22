import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { findOwnedSet } from '#services/skripsi/v2/skripsiSetOwnership'

export class GetSkripsiSectionsV2Service extends BaseService {
  static async call({ setId, userId }) {
    const set = await findOwnedSet(setId, userId)

    return prisma.skripsi_sections.findMany({
      where: { set_id: set.id },
      orderBy: [{ position: 'asc' }, { id: 'asc' }],
    })
  }
}
