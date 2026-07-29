import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import { AuthorizationError } from '#errors/authorizationError'
import attachmentService from '#services/attachment/attachmentService'
import { AtlasQuizAnatomyQuizSerializer } from '#serializers/api/v2/atlasQuizAnatomyQuizSerializer'

export class GetAtlasQuizAnatomyQuizDetailService extends BaseService {
  static async call({ slug, uniqueId, userRole = 'user' }) {
    const topic = await prisma.feature_nodes.findUnique({ where: { slug } })
    if (!topic) throw new ValidationError('Topik tidak ditemukan')

    const quiz = await prisma.anatomy_quizzes.findFirst({
      where: { unique_id: uniqueId, is_deleted: false },
    })
    if (!quiz) throw new ValidationError('Quiz tidak ditemukan')
    if (userRole === 'user' && quiz.status !== 'published') throw new AuthorizationError('Quiz tidak tersedia')

    const [attachment, mod] = await Promise.all([
      this.fetchAttachment(quiz.id),
      this.fetchModule(quiz.id, topic.id),
    ])

    return {
      quiz: AtlasQuizAnatomyQuizSerializer.serialize(quiz, attachment),
      module: mod ? { id: mod.id, name: mod.name } : null,
      topicName: topic.name,
    }
  }

  static async fetchAttachment(quizId) {
    return attachmentService.getAttachmentWithUrl('anatomy_quiz', quizId, 'image')
  }

  static async fetchModule(quizId, topicId) {
    const nodeRecord = await prisma.feature_node_records.findFirst({
      where: {
        record_id: quizId,
        record_type: 'anatomy_quiz',
        node: { parent_id: topicId, layer: 2, node_type: 'module' },
      },
      include: { node: true },
    })
    return nodeRecord?.node ?? null
  }

}
