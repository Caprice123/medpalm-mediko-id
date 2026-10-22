import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import { bumpNodeStat } from '#utils/nodeStatisticsHelper'

export class DeleteNodeQuestionService extends BaseService {
  static async call({ nodeId, questionId }) {
    const record = await prisma.feature_node_records.findUnique({
      where: { node_id_record_type_record_id: { node_id: parseInt(nodeId), record_type: 'mcq_question', record_id: parseInt(questionId) } },
    })
    if (!record) throw new ValidationError('Pertanyaan tidak ditemukan di node ini')

    // Soft delete: past answers and progress still reference the question,
    // so the row and its attachment are kept
    await prisma.$transaction(async (tx) => {
      await tx.feature_node_records.delete({ where: { id: record.id } })

      await tx.mcq_questions.update({
        where: { id: parseInt(questionId) },
        data: { is_deleted: true, deleted_at: new Date() },
      })

      await bumpNodeStat(tx, parseInt(nodeId), 'mcq_question', -1)
    })
  }
}
