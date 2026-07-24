import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class DecrementNodeProgressOnDeleteService extends BaseService {
  static async call({ cardId }) {
    const [card, reviewStates] = await Promise.all([
      prisma.flashcard_cards.findUnique({ where: { id: cardId }, select: { node_id: true } }),
      prisma.user_review_states.findMany({
        where: { record_type: 'flashcard_card', record_id: cardId },
        select: { user_id: true, last_rating: true },
      }),
    ])

    if (!card?.node_id || reviewStates.length === 0) return

    const subtopic = await prisma.feature_nodes.findUnique({
      where: { id: card.node_id },
      select: { parent_id: true },
    })
    const topicNodeId = subtopic?.parent_id
    if (!topicNodeId) return

    await Promise.all(
      reviewStates.flatMap(s => [
        prisma.$executeRaw`
          UPDATE user_node_progress
          SET
            again_count = GREATEST(0, again_count - CASE WHEN ${s.last_rating} = 'again' THEN 1 ELSE 0 END),
            hard_count  = GREATEST(0, hard_count  - CASE WHEN ${s.last_rating} = 'hard'  THEN 1 ELSE 0 END),
            good_count  = GREATEST(0, good_count  - CASE WHEN ${s.last_rating} = 'good'  THEN 1 ELSE 0 END),
            easy_count  = GREATEST(0, easy_count  - CASE WHEN ${s.last_rating} = 'easy'  THEN 1 ELSE 0 END),
            updated_at  = NOW()
          WHERE user_id     = ${s.user_id}
            AND node_id     = ${topicNodeId}
            AND feature_type = 'flashcard_card'
        `,
        prisma.user_feature_statistics.update({
          where: { user_id_feature_statistic_type: { user_id: s.user_id, feature: 'flashcard_card', statistic_type: s.last_rating } },
          data: { statistic_count: { decrement: 1 } },
        }),
      ])
    )
  }
}
