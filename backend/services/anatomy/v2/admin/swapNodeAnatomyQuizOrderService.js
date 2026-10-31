import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'

export class SwapNodeAnatomyQuizOrderService extends BaseService {
  static async call({ nodeId, quizId, withQuizId }) {
    const parsedNodeId = parseInt(nodeId)
    const [recordA, recordB] = await Promise.all([
      prisma.feature_node_records.findFirst({ where: { node_id: parsedNodeId, record_type: 'anatomy_quiz', record_id: parseInt(quizId) } }),
      prisma.feature_node_records.findFirst({ where: { node_id: parsedNodeId, record_type: 'anatomy_quiz', record_id: parseInt(withQuizId) } }),
    ])
    if (!recordA || !recordB) throw new ValidationError('Konten tidak ditemukan di modul ini')
    if (recordA.order === null || recordB.order === null) throw new ValidationError('Konten ini belum memiliki urutan')

    await prisma.$transaction([
      prisma.feature_node_records.update({ where: { id: recordA.id }, data: { order: recordB.order } }),
      prisma.feature_node_records.update({ where: { id: recordB.id }, data: { order: recordA.order } }),
    ])
  }
}
