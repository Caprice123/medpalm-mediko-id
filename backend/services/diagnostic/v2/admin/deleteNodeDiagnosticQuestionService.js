import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import { bumpNodeStat } from '#utils/nodeStatisticsHelper'

const RECORD_TYPE = 'diagnostic_question'

export class DeleteNodeDiagnosticQuestionService extends BaseService {
  static async call({ questionId }) {
    const question = await prisma.diagnostic_questions.findUnique({ where: { id: parseInt(questionId) } })
    if (!question || question.is_deleted) throw new ValidationError('Pertanyaan tidak ditemukan')

    const fnRecord = await prisma.feature_node_records.findFirst({
      where: { record_type: RECORD_TYPE, record_id: parseInt(questionId) },
    })
    const subtopicNodeId = fnRecord?.node_id ?? null

    const topicId = subtopicNodeId
      ? (await prisma.feature_nodes.findUnique({ where: { id: subtopicNodeId }, select: { parent_id: true } }))?.parent_id ?? null
      : null

    // Soft delete: the row, its attachment and users' review states are kept so past
    // answers stay valid; rating counts are still removed from node progress below
    await prisma.$transaction(async (tx) => {
      await tx.diagnostic_questions.update({
        where: { id: parseInt(questionId) },
        data: { is_deleted: true, deleted_at: new Date() },
      })

      if (fnRecord) {
        await tx.feature_node_records.delete({ where: { id: fnRecord.id } })
      }

      if (subtopicNodeId) {
        await bumpNodeStat(tx, subtopicNodeId, RECORD_TYPE, -1)

        await tx.$executeRaw`
          UPDATE user_node_progress unp
          SET
            again_count = GREATEST(0, unp.again_count - CASE WHEN urs.last_rating = 'again' THEN 1 ELSE 0 END),
            hard_count  = GREATEST(0, unp.hard_count  - CASE WHEN urs.last_rating = 'hard'  THEN 1 ELSE 0 END),
            good_count  = GREATEST(0, unp.good_count  - CASE WHEN urs.last_rating = 'good'  THEN 1 ELSE 0 END),
            easy_count  = GREATEST(0, unp.easy_count  - CASE WHEN urs.last_rating = 'easy'  THEN 1 ELSE 0 END),
            updated_at  = NOW()
          FROM user_review_states urs
          WHERE urs.record_id    = ${parseInt(questionId)}
            AND urs.record_type  = ${RECORD_TYPE}
            AND unp.user_id      = urs.user_id
            AND unp.node_id      = ${subtopicNodeId}
            AND unp.feature_type = ${RECORD_TYPE}
        `
      }

      if (topicId) {
        await tx.$executeRaw`
          UPDATE user_node_progress unp
          SET
            again_count = GREATEST(0, unp.again_count - CASE WHEN urs.last_rating = 'again' THEN 1 ELSE 0 END),
            hard_count  = GREATEST(0, unp.hard_count  - CASE WHEN urs.last_rating = 'hard'  THEN 1 ELSE 0 END),
            good_count  = GREATEST(0, unp.good_count  - CASE WHEN urs.last_rating = 'good'  THEN 1 ELSE 0 END),
            easy_count  = GREATEST(0, unp.easy_count  - CASE WHEN urs.last_rating = 'easy'  THEN 1 ELSE 0 END),
            updated_at  = NOW()
          FROM user_review_states urs
          WHERE urs.record_id    = ${parseInt(questionId)}
            AND urs.record_type  = ${RECORD_TYPE}
            AND unp.user_id      = urs.user_id
            AND unp.node_id      = ${topicId}
            AND unp.feature_type = ${RECORD_TYPE}
        `
      }

      await tx.$executeRaw`
        UPDATE user_feature_statistics ufs
        SET statistic_count = GREATEST(0, ufs.statistic_count - 1),
            updated_at      = NOW()
        FROM user_review_states urs
        WHERE urs.record_id      = ${parseInt(questionId)}
          AND urs.record_type    = ${RECORD_TYPE}
          AND ufs.user_id        = urs.user_id
          AND ufs.feature        = ${RECORD_TYPE}
          AND ufs.statistic_type = urs.last_rating
      `
    })
  }
}
