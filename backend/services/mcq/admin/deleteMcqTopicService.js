import { ValidationError } from '../../../errors/validationError.js'
import prisma from '../../../prisma/client.js'
import { BaseService } from '../../baseService.js'

export class DeleteMcqTopicService extends BaseService {
  static async call({ id }) {
    // Validate topic exists
    const existingTopic = await prisma.mcq_topics.findUnique({
      where: { id }
    })

    if (!existingTopic) {
      throw new ValidationError('MCQ topic not found')
    }

    // Delete topic (cascade will handle questions, tags, attempts)
    await prisma.mcq_topics.delete({
      where: { id }
    })

    return { success: true }
  }
}
