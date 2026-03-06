import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class DeleteExerciseTopicService extends BaseService {
  static async call(uniqueId) {
    if (!uniqueId) {
      throw new ValidationError('Topic unique ID is required')
    }

    const topic = await prisma.exercise_topics.findUnique({
      where: { unique_id: uniqueId }
    })

    if (!topic) {
      throw new ValidationError('Topic not found')
    }

    await prisma.exercise_topics.update({
      where: { id: topic.id },
      data: {
        is_deleted: true,
        deleted_at: new Date()
      }
    })

    return { uniqueId }
  }
}
