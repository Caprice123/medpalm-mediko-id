import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class DeleteMcqTopicService extends BaseService {
  static async call({ id }) {
    // Validate topic exists
    const existingTopic = await prisma.mcq_topics.findUnique({
      where: { unique_id: id }
    })

    if (!existingTopic) {
      throw new ValidationError('MCQ topic not found')
    }

    await prisma.mcq_topics.update({
      where: { id: existingTopic.id },
      data: {
        is_deleted: true,
        deleted_at: new Date()
      }
    })

    return { success: true }
  }
}
