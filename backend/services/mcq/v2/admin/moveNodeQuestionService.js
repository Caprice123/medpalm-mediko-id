import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'

export class MoveNodeQuestionService extends BaseService {
  static async call({ nodeId, questionId, targetNodeId }) {
    const record = await prisma.feature_node_records.findUnique({
      where: { node_id_record_type_record_id: { node_id: parseInt(nodeId), record_type: 'mcq_question', record_id: parseInt(questionId) } },
    })
    if (!record) throw new ValidationError('Pertanyaan tidak ditemukan di node ini')

    const targetNode = await prisma.feature_nodes.findUnique({ where: { id: parseInt(targetNodeId) } })
    if (!targetNode) throw new ValidationError('Node tujuan tidak ditemukan')

    await prisma.feature_node_records.update({
      where: { id: record.id },
      data: { node_id: parseInt(targetNodeId) },
    })

    await prisma.node_statistics.updateMany({
      where: { node_id: parseInt(nodeId), record_type: 'mcq_question' },
      data: { total_count: { decrement: 1 } },
    })
    await prisma.node_statistics.upsert({
      where: { node_id_record_type: { node_id: parseInt(targetNodeId), record_type: 'mcq_question' } },
      create: { node_id: parseInt(targetNodeId), record_type: 'mcq_question', total_count: 1 },
      update: { total_count: { increment: 1 } },
    })
  }
}
