import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'

const RECORD_TYPE = 'flashcard_card'

export class MoveNodeCardService extends BaseService {
  static async call({ cardId, targetNodeId }) {
    const card = await prisma.flashcard_cards.findUnique({ where: { id: parseInt(cardId) } })
    if (!card) throw new ValidationError('Kartu tidak ditemukan')

    const targetNode = await prisma.feature_nodes.findUnique({ where: { id: parseInt(targetNodeId) } })
    if (!targetNode) throw new ValidationError('Sub-topik tujuan tidak ditemukan')

    const sourceNodeId = card.node_id

    // Resolve topic-level (parent) node ids for both source and target subtopics
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
      // 1. Move the card
      await tx.flashcard_cards.update({
        where: { id: parseInt(cardId) },
        data: { node_id: parseInt(targetNodeId) },
      })

      // 2. Update node_statistics subtopic counts
      const statsOps = []
      if (sourceNodeId) {
        statsOps.push(
          tx.node_statistics.upsert({
            where: { node_id_record_type: { node_id: sourceNodeId, record_type: RECORD_TYPE } },
            create: { node_id: sourceNodeId, record_type: RECORD_TYPE, total_count: 0 },
            update: { total_count: { decrement: 1 } },
          })
        )
      }
      statsOps.push(
        tx.node_statistics.upsert({
          where: { node_id_record_type: { node_id: parseInt(targetNodeId), record_type: RECORD_TYPE } },
          create: { node_id: parseInt(targetNodeId), record_type: RECORD_TYPE, total_count: 1 },
          update: { total_count: { increment: 1 } },
        })
      )
      await Promise.all(statsOps)

      // 3. Adjust user_node_progress only when the topic changes
      if (!topicChanged) return

      if (sourceTopicId) {
        // Decrement the rating bucket for every user who reviewed this card
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
        // Upsert: create a row for new users, increment for existing ones
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
