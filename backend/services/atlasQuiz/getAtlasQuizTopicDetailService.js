import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'

export class GetAtlasQuizTopicDetailService extends BaseService {
  static async call({ slug }) {
    const topic = await prisma.feature_nodes.findUnique({ where: { slug } })
    if (!topic || topic.layer !== 1) throw new ValidationError('Topik tidak ditemukan')

    return {
      id: topic.id,
      name: topic.name,
      slug: topic.slug,
      description: topic.description,
      icon: topic.icon,
      classification: topic.classification,
    }
  }
}
