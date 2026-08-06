import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'

const RECORD_TYPE = 'diagnostic_question'

export class MoveLinkedDiagnosticQuestionService extends BaseService {
  static async call({ questionId, nodeId }) {
    const question = await prisma.diagnostic_questions.findUnique({ where: { id: parseInt(questionId) } })
    if (!question) throw new ValidationError('Pertanyaan tidak ditemukan')

    const targetNode = await prisma.feature_nodes.findUnique({ where: { id: parseInt(nodeId) } })
    if (!targetNode) throw new ValidationError('Sub-topik tidak ditemukan')
    if (targetNode.layer !== 2) throw new ValidationError('Soal hanya dapat dipindah ke sub-topik (layer 2)')

    const existing = await prisma.feature_node_records.findFirst({
      where: { record_type: RECORD_TYPE, record_id: parseInt(questionId) },
    })
    if (!existing) throw new ValidationError('Soal belum tertaut ke sub-topik manapun')
    if (existing.node_id === parseInt(nodeId)) throw new ValidationError('Soal sudah berada di sub-topik ini')

    const oldNodeId = existing.node_id
    const parsedQuestionId = parseInt(questionId)
    const parsedTargetNodeId = parseInt(nodeId)

    const [sourceSubmodule, targetSubmodule] = await Promise.all([
      prisma.feature_nodes.findUnique({ where: { id: oldNodeId }, select: { parent_id: true } }),
      prisma.feature_nodes.findUnique({ where: { id: parsedTargetNodeId }, select: { parent_id: true } }),
    ])
    const sourceTopicId = sourceSubmodule?.parent_id ?? null
    const targetTopicId = targetSubmodule?.parent_id ?? null
    const topicChanged = sourceTopicId !== targetTopicId

    await prisma.$transaction(async (tx) => {
      await tx.feature_node_records.update({
        where: { id: existing.id },
        data: { node_id: parsedTargetNodeId },
      })

      await tx.node_statistics.updateMany({
        where: { node_id: oldNodeId, record_type: RECORD_TYPE },
        data: { total_count: { decrement: 1 } },
      })

      await tx.node_statistics.upsert({
        where: { node_id_record_type: { node_id: parsedTargetNodeId, record_type: RECORD_TYPE } },
        create: { node_id: parsedTargetNodeId, record_type: RECORD_TYPE, total_count: 1 },
        update: { total_count: { increment: 1 } },
      })

      // Move submodule-level user_node_progress rating counts (always — a question can
      // move between submodules within the same module without the module changing)
      await tx.$executeRaw`
        UPDATE user_node_progress unp
        SET
          again_count = unp.again_count - CASE WHEN urs.last_rating = 'again' THEN 1 ELSE 0 END,
          hard_count  = unp.hard_count  - CASE WHEN urs.last_rating = 'hard'  THEN 1 ELSE 0 END,
          good_count  = unp.good_count  - CASE WHEN urs.last_rating = 'good'  THEN 1 ELSE 0 END,
          easy_count  = unp.easy_count  - CASE WHEN urs.last_rating = 'easy'  THEN 1 ELSE 0 END,
          updated_at  = NOW()
        FROM user_review_states urs
        WHERE urs.record_id   = ${parsedQuestionId}
          AND urs.record_type = ${RECORD_TYPE}
          AND unp.user_id     = urs.user_id
          AND unp.node_id     = ${oldNodeId}
          AND unp.feature_type = ${RECORD_TYPE}
      `

      await tx.$executeRaw`
        INSERT INTO user_node_progress (user_id, node_id, feature_type, again_count, hard_count, good_count, easy_count, updated_at)
        SELECT
          urs.user_id,
          ${parsedTargetNodeId},
          ${RECORD_TYPE},
          CASE WHEN urs.last_rating = 'again' THEN 1 ELSE 0 END,
          CASE WHEN urs.last_rating = 'hard'  THEN 1 ELSE 0 END,
          CASE WHEN urs.last_rating = 'good'  THEN 1 ELSE 0 END,
          CASE WHEN urs.last_rating = 'easy'  THEN 1 ELSE 0 END,
          NOW()
        FROM user_review_states urs
        WHERE urs.record_id   = ${parsedQuestionId}
          AND urs.record_type = ${RECORD_TYPE}
        ON CONFLICT (user_id, node_id, feature_type) DO UPDATE SET
          again_count  = user_node_progress.again_count + EXCLUDED.again_count,
          hard_count   = user_node_progress.hard_count  + EXCLUDED.hard_count,
          good_count   = user_node_progress.good_count  + EXCLUDED.good_count,
          easy_count   = user_node_progress.easy_count  + EXCLUDED.easy_count,
          updated_at   = NOW()
      `

      if (!topicChanged) return

      // Module-level rating counts only need to move when the module actually changed
      if (sourceTopicId) {
        await tx.$executeRaw`
          UPDATE user_node_progress unp
          SET
            again_count = unp.again_count - CASE WHEN urs.last_rating = 'again' THEN 1 ELSE 0 END,
            hard_count  = unp.hard_count  - CASE WHEN urs.last_rating = 'hard'  THEN 1 ELSE 0 END,
            good_count  = unp.good_count  - CASE WHEN urs.last_rating = 'good'  THEN 1 ELSE 0 END,
            easy_count  = unp.easy_count  - CASE WHEN urs.last_rating = 'easy'  THEN 1 ELSE 0 END,
            updated_at  = NOW()
          FROM user_review_states urs
          WHERE urs.record_id   = ${parsedQuestionId}
            AND urs.record_type = ${RECORD_TYPE}
            AND unp.user_id     = urs.user_id
            AND unp.node_id     = ${sourceTopicId}
            AND unp.feature_type = ${RECORD_TYPE}
        `
      }

      if (targetTopicId) {
        await tx.$executeRaw`
          INSERT INTO user_node_progress (user_id, node_id, feature_type, again_count, hard_count, good_count, easy_count, updated_at)
          SELECT
            urs.user_id,
            ${targetTopicId},
            ${RECORD_TYPE},
            CASE WHEN urs.last_rating = 'again' THEN 1 ELSE 0 END,
            CASE WHEN urs.last_rating = 'hard'  THEN 1 ELSE 0 END,
            CASE WHEN urs.last_rating = 'good'  THEN 1 ELSE 0 END,
            CASE WHEN urs.last_rating = 'easy'  THEN 1 ELSE 0 END,
            NOW()
          FROM user_review_states urs
          WHERE urs.record_id   = ${parsedQuestionId}
            AND urs.record_type = ${RECORD_TYPE}
          ON CONFLICT (user_id, node_id, feature_type) DO UPDATE SET
            again_count  = user_node_progress.again_count + EXCLUDED.again_count,
            hard_count   = user_node_progress.hard_count  + EXCLUDED.hard_count,
            good_count   = user_node_progress.good_count  + EXCLUDED.good_count,
            easy_count   = user_node_progress.easy_count  + EXCLUDED.easy_count,
            updated_at   = NOW()
        `
      }
    })
  }
}
