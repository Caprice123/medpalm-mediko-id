import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import { decrementNodeStat } from '#utils/nodeStatisticsHelper'

export class UnlinkNodeAnatomyQuizService extends BaseService {
  static async call({ nodeId, quizId }) {
    const record = await prisma.feature_node_records.findFirst({
      where: { node_id: parseInt(nodeId), record_type: 'anatomy_quiz', record_id: parseInt(quizId) },
    })
    if (!record) throw new ValidationError('Konten tidak ditemukan di modul ini')
    await prisma.feature_node_records.delete({ where: { id: record.id } })
    await decrementNodeStat(record.node_id, 'anatomy_quiz')
  }
}
