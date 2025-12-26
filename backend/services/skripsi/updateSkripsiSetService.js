import prisma from '../../prisma/client.js'
import { BaseService } from '../baseService.js'
import { NotFoundError } from '../../errors/notFoundError.js'
import { ValidationError } from '../../errors/validationError.js'

export class UpdateSkripsiSetService extends BaseService {
  static async call({ setId, userId, title, description }) {
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

    if (title !== undefined && title.trim() === '') {
      throw new ValidationError('Title cannot be empty')
    }

    // Update the set
    const updatedSet = await prisma.skripsi_sets.update({
      where: { id: setId },
      data: {
        title: title?.trim() || set.title,
        description: description?.trim() || set.description,
        updated_at: new Date()
      }
    })

    return updatedSet
  }
}
