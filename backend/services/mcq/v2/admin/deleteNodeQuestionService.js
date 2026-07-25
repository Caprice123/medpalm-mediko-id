import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import attachmentService from '#services/attachment/attachmentService'

export class DeleteNodeQuestionService extends BaseService {
  static async call({ nodeId, questionId }) {
    const record = await prisma.feature_node_records.findUnique({
      where: { node_id_record_type_record_id: { node_id: parseInt(nodeId), record_type: 'mcq_question', record_id: parseInt(questionId) } },
    })
    if (!record) throw new ValidationError('Pertanyaan tidak ditemukan di node ini')

    await prisma.feature_node_records.delete({ where: { id: record.id } })

    await attachmentService.detachAll({ recordType: 'mcq_question', recordId: parseInt(questionId) })
    await prisma.mcq_questions.delete({ where: { id: parseInt(questionId) } })

    await prisma.node_statistics.updateMany({
      where: { node_id: parseInt(nodeId), record_type: 'mcq_question' },
      data: { total_count: { decrement: 1 } },
    })
  }
}
