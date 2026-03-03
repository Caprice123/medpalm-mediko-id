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

    // Delete in order: tags, questions, attachments, then topic
    await prisma.exercise_topic_tags.deleteMany({ where: { topic_id: topic.id } })
    await prisma.exercise_questions.deleteMany({ where: { topic_id: topic.id } })
    await prisma.attachments.deleteMany({
      where: { record_type: 'exercise_topic', record_id: topic.id }
    })
    await prisma.exercise_topics.delete({ where: { id: topic.id } })

    return { uniqueId }
  }
}
