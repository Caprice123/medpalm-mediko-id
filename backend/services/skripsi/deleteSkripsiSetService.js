import prisma from '../../prisma/client.js'
import { BaseService } from '../baseService.js'
import { NotFoundError } from '../../errors/notFoundError.js'

export class DeleteSkripsiSetService extends BaseService {
  static async call({ setId, userId }) {
    // Verify ownership
    const set = await prisma.skripsi_sets.findFirst({
      where: {
        id: setId,
        user_id: userId,
        is_deleted: false
      }
    })

    if (!set) {
      throw new NotFoundError('Skripsi set not found')
    }

    // Soft delete
    await prisma.skripsi_sets.update({
      where: { id: setId },
      data: {
        is_deleted: true,
        updated_at: new Date()
      }
    })

    return { message: 'Skripsi set deleted successfully' }
  }
}
