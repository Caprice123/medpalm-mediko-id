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

    // Clean up summary note links first to avoid orphaned relations
    await prisma.summary_note_mcq_topics.deleteMany({ where: { mcq_topic_id: existingTopic.id } })

    await prisma.$executeRaw`DELETE FROM mcq_topics WHERE id = ${existingTopic.id}`

    return { success: true }
  }
}
