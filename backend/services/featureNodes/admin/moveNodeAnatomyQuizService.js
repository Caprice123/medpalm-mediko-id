import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'

export class MoveNodeAnatomyQuizService extends BaseService {
  static async call({ nodeId, quizId, targetNodeId }) {
    const record = await prisma.feature_node_records.findFirst({
      where: { node_id: parseInt(nodeId), record_type: 'anatomy_quiz', record_id: parseInt(quizId) },
    })
    if (!record) throw new ValidationError('Konten tidak ditemukan di modul ini')

    const targetNode = await prisma.feature_nodes.findUnique({ where: { id: parseInt(targetNodeId) } })
    if (!targetNode) throw new ValidationError('Modul tujuan tidak ditemukan')

    const existing = await prisma.feature_node_records.findFirst({
      where: { node_id: parseInt(targetNodeId), record_type: 'anatomy_quiz', record_id: parseInt(quizId) },
    })
    if (existing) throw new ValidationError('Konten sudah ada di modul tujuan')

    await prisma.feature_node_records.update({
      where: { id: record.id },
      data: { node_id: parseInt(targetNodeId) },
    })
  }
}
