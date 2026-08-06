import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import { bumpNodeStat } from '#utils/nodeStatisticsHelper'

const RECORD_TYPE = 'flashcard_card'

export class MoveNodeCardService extends BaseService {
  static async call({ cardId, targetNodeId }) {
    const card = await prisma.flashcard_cards.findUnique({ where: { id: parseInt(cardId) } })
    if (!card) throw new ValidationError('Kartu tidak ditemukan')

    const targetNode = await prisma.feature_nodes.findUnique({ where: { id: parseInt(targetNodeId) } })
    if (!targetNode) throw new ValidationError('Sub-topik tujuan tidak ditemukan')

    const record = await prisma.feature_node_records.findFirst({
      where: { record_type: RECORD_TYPE, record_id: parseInt(cardId) },
    })
    const sourceNodeId = record?.node_id ?? null

    const [sourceSubtopic, targetSubtopic] = await Promise.all([
      sourceNodeId
        ? prisma.feature_nodes.findUnique({ where: { id: sourceNodeId }, select: { parent_id: true } })
        : null,
      prisma.feature_nodes.findUnique({ where: { id: parseInt(targetNodeId) }, select: { parent_id: true } }),
    ])

    const sourceTopicId = sourceSubtopic?.parent_id ?? null
    const targetTopicId = targetSubtopic?.parent_id ?? null
    const topicChanged = sourceTopicId !== targetTopicId

    await prisma.$transaction(async (tx) => {
      // 1. Move the record
      if (record) {
        await tx.feature_node_records.update({
          where: { id: record.id },
          data: { node_id: parseInt(targetNodeId) },
        })
      } else {
        await tx.feature_node_records.create({
          data: { node_id: parseInt(targetNodeId), record_type: RECORD_TYPE, record_id: parseInt(cardId) },
        })
      }

      // 2. Update node_statistics subtopic counts
      if (sourceNodeId) {
        await bumpNodeStat(tx, sourceNodeId, RECORD_TYPE, -1)
      }
      await bumpNodeStat(tx, parseInt(targetNodeId), RECORD_TYPE, 1)

      // 3. Move subtopic-level user_node_progress rating counts (always — a card can
      // move between subtopics within the same topic without the topic changing)
      if (sourceNodeId) {
        await tx.$executeRaw`
          UPDATE user_node_progress unp
          SET
            again_count = unp.again_count - CASE WHEN urs.last_rating = 'again' THEN 1 ELSE 0 END,
            hard_count  = unp.hard_count  - CASE WHEN urs.last_rating = 'hard'  THEN 1 ELSE 0 END,
            good_count  = unp.good_count  - CASE WHEN urs.last_rating = 'good'  THEN 1 ELSE 0 END,
            easy_count  = unp.easy_count  - CASE WHEN urs.last_rating = 'easy'  THEN 1 ELSE 0 END,
            updated_at  = NOW()
          FROM user_review_states urs
          WHERE urs.record_id   = ${parseInt(cardId)}
            AND urs.record_type = ${RECORD_TYPE}
            AND unp.user_id     = urs.user_id
            AND unp.node_id     = ${sourceNodeId}
            AND unp.feature_type = ${RECORD_TYPE}
        `
      }

      await tx.$executeRaw`
        INSERT INTO user_node_progress (user_id, node_id, feature_type, again_count, hard_count, good_count, easy_count, updated_at)
        SELECT
          urs.user_id,
          ${parseInt(targetNodeId)},
          ${RECORD_TYPE},
          CASE WHEN urs.last_rating = 'again' THEN 1 ELSE 0 END,
          CASE WHEN urs.last_rating = 'hard'  THEN 1 ELSE 0 END,
          CASE WHEN urs.last_rating = 'good'  THEN 1 ELSE 0 END,
          CASE WHEN urs.last_rating = 'easy'  THEN 1 ELSE 0 END,
          NOW()
        FROM user_review_states urs
        WHERE urs.record_id   = ${parseInt(cardId)}
          AND urs.record_type = ${RECORD_TYPE}
        ON CONFLICT (user_id, node_id, feature_type) DO UPDATE SET
          again_count  = user_node_progress.again_count + EXCLUDED.again_count,
          hard_count   = user_node_progress.hard_count  + EXCLUDED.hard_count,
          good_count   = user_node_progress.good_count  + EXCLUDED.good_count,
          easy_count   = user_node_progress.easy_count  + EXCLUDED.easy_count,
          updated_at   = NOW()
      `

      if (!topicChanged) return

      // 4. Update node_statistics topic counts
      if (sourceTopicId) {
        await bumpNodeStat(tx, sourceTopicId, RECORD_TYPE, -1)
      }
      if (targetTopicId) {
        await bumpNodeStat(tx, targetTopicId, RECORD_TYPE, 1)
      }

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
          WHERE urs.record_id   = ${parseInt(cardId)}
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
          WHERE urs.record_id   = ${parseInt(cardId)}
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
