import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import { CreateAnatomyQuizService } from '#services/anatomy/admin/createAnatomyQuizService'
import { AssignAnatomyToNodeService } from '#services/anatomy/v2/admin/assignAnatomyToNodeService'

export class CreateAnatomyQuizV2Service extends BaseService {
  static async call({ nodeId, title, description, embedUrl, questionCount, tags, status, createdBy }) {
    if (!nodeId) throw new ValidationError('Node ID wajib diisi')

    const parsedNodeId = parseInt(nodeId)
    // Checked before the quiz is created so a bad nodeId can't leave an orphan quiz behind.
    const node = await prisma.feature_nodes.findUnique({ where: { id: parsedNodeId } })
    if (!node) throw new ValidationError('Modul tidak ditemukan')

    const quiz = await CreateAnatomyQuizService.call({
      title,
      description,
      embedUrl: embedUrl || null,
      questionCount: questionCount !== undefined ? parseInt(questionCount) : undefined,
      mediaType: '3d',
      tags,
      status: status || 'published',
      version: 2,
      createdBy,
    })

    // Linking goes through the assign path so a freshly created quiz gets its append
    // `order` and bumps the node's `anatomy_quiz` statistic — both of which a bare
    // feature_node_records.create() silently skipped.
    await AssignAnatomyToNodeService.call({ uniqueId: quiz.unique_id, nodeId: parsedNodeId })

    return quiz
  }
}
