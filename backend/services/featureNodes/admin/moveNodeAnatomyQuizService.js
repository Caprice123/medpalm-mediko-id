import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import { incrementNodeStat, decrementNodeStat } from '#utils/nodeStatisticsHelper'

export class MoveNodeAnatomyQuizService extends BaseService {
  static async call({ nodeId, quizId, targetNodeId }) {
    const parsedNodeId = parseInt(nodeId)
    const parsedTargetNodeId = parseInt(targetNodeId)

    const record = await prisma.feature_node_records.findFirst({
      where: { node_id: parsedNodeId, record_type: 'anatomy_quiz', record_id: parseInt(quizId) },
    })
    if (!record) throw new ValidationError('Konten tidak ditemukan di modul ini')

    const targetNode = await prisma.feature_nodes.findUnique({ where: { id: parsedTargetNodeId } })
    if (!targetNode) throw new ValidationError('Modul tujuan tidak ditemukan')

    const existing = await prisma.feature_node_records.findFirst({
      where: { node_id: parsedTargetNodeId, record_type: 'anatomy_quiz', record_id: parseInt(quizId) },
    })
    if (existing) throw new ValidationError('Konten sudah ada di modul tujuan')

    await prisma.feature_node_records.update({
      where: { id: record.id },
      data: { node_id: parsedTargetNodeId },
    })
    await decrementNodeStat(parsedNodeId, 'anatomy_quiz')
    await incrementNodeStat(parsedTargetNodeId, 'anatomy_quiz')
  }
}
