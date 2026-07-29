import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import { incrementNodeStat } from '#utils/nodeStatisticsHelper'

export class AssignAnatomyToNodeService extends BaseService {
  static async call({ uniqueId, nodeId }) {
    const quiz = await prisma.anatomy_quizzes.findUnique({ where: { unique_id: uniqueId } })
    if (!quiz) throw new ValidationError('Quiz anatomi tidak ditemukan')

    const existing = await prisma.feature_node_records.findFirst({
      where: { record_type: 'anatomy_quiz', record_id: quiz.id },
    })
    if (existing) throw new ValidationError('Quiz anatomi ini sudah terhubung ke modul')

    const parsedNodeId = parseInt(nodeId)
    const node = await prisma.feature_nodes.findUnique({ where: { id: parsedNodeId } })
    if (!node) throw new ValidationError('Modul tidak ditemukan')

    await prisma.feature_node_records.create({
      data: { node_id: parsedNodeId, record_type: 'anatomy_quiz', record_id: quiz.id },
    })
    await incrementNodeStat(parsedNodeId, 'anatomy_quiz')
  }
}
