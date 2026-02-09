import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { NotFoundError } from '#errors/notFoundError'

export class UpdateSetContentService extends BaseService {
  static async call({ setId, userId, editorContent }) {
    // Verify ownership
    const set = await prisma.skripsi_sets.findFirst({
      where: {
        unique_id: setId,
        user_id: userId,
        is_deleted: false
      }
    })

    if (!set) {
      throw new NotFoundError('Skripsi set not found')
    }

    // Update the set with new content
    const updatedSet = await prisma.skripsi_sets.update({
      where: { unique_id: setId },
      data: {
        editor_content: editorContent,
        updated_at: new Date()
      }
    })

    return updatedSet
  }
}
