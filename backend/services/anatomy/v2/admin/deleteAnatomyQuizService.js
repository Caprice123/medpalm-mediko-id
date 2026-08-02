import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { decrementNodeStat } from '#utils/nodeStatisticsHelper'

export class DeleteAnatomyQuizV2Service extends BaseService {
  static async call(quizId) {
    if (!quizId || typeof quizId !== 'string') throw new ValidationError('Quiz ID wajib diisi')

    const quiz = await prisma.anatomy_quizzes.findUnique({ where: { unique_id: quizId } })
    if (!quiz) throw new ValidationError('Quiz tidak ditemukan')

    const record = await prisma.feature_node_records.findFirst({
      where: { record_type: 'anatomy_quiz', record_id: quiz.id },
    })

    await prisma.anatomy_quizzes.update({
      where: { id: quiz.id },
      data: { is_deleted: true, deleted_at: new Date() },
    })

    if (record) {
      await prisma.feature_node_records.delete({ where: { id: record.id } })
      await decrementNodeStat(record.node_id, 'anatomy_quiz')
    }
  }
}
