import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import { computeNextReview } from '#services/review/srsAlgorithm'

const VALID_RATINGS = ['again', 'hard', 'good', 'easy']
const RECORD_TYPE = 'flashcard_card'

export class RateFlashcardCardService extends BaseService {
  static async call({ userId, recordId, rating }) {
    if (!VALID_RATINGS.includes(rating)) {
      throw new ValidationError('Rating tidak valid')
    }

    const existing = await prisma.user_review_states.findUnique({
      where: {
        user_id_record_type_record_id: { user_id: userId, record_type: RECORD_TYPE, record_id: recordId },
      },
    })

    const { interval, easeFactor, dueDate } = computeNextReview({
      interval: existing?.interval ?? 1,
      easeFactor: existing?.ease_factor ?? 2.5,
      rating,
    })

    const reviewStateOp = prisma.user_review_states.upsert({
      where: {
        user_id_record_type_record_id: { user_id: userId, record_type: RECORD_TYPE, record_id: recordId },
      },
      create: {
        user_id: userId,
        record_type: RECORD_TYPE,
        record_id: recordId,
        interval,
        ease_factor: easeFactor,
        due_date: dueDate,
        review_count: 1,
        last_rating: rating,
      },
      update: {
        interval,
        ease_factor: easeFactor,
        due_date: dueDate,
        review_count: { increment: 1 },
        last_rating: rating,
        updated_at: new Date(),
      },
    })

    const card = await prisma.flashcard_cards.findUnique({
      where: { id: recordId },
      select: { node_id: true },
    })
    const subtopic = card?.node_id
      ? await prisma.feature_nodes.findUnique({ where: { id: card.node_id }, select: { parent_id: true } })
      : null
    const topicNodeId = subtopic?.parent_id

    if (!topicNodeId) {
      await reviewStateOp
      return
    }

    const oldRating = existing?.last_rating

    const nodeProgressOp = prisma.user_node_progress.upsert({
      where: {
        user_id_node_id_feature_type: { user_id: userId, node_id: topicNodeId, feature_type: RECORD_TYPE },
      },
      create: {
        user_id: userId,
        node_id: topicNodeId,
        feature_type: RECORD_TYPE,
        again_count: rating === 'again' ? 1 : 0,
        hard_count:  rating === 'hard'  ? 1 : 0,
        good_count:  rating === 'good'  ? 1 : 0,
        easy_count:  rating === 'easy'  ? 1 : 0,
      },
      update: {
        [`${rating}_count`]: { increment: 1 },
        ...(oldRating && oldRating !== rating ? { [`${oldRating}_count`]: { increment: -1 } } : {}),
        updated_at: new Date(),
      },
    })

    const featureStatsOps = [
      prisma.user_feature_statistics.upsert({
        where: {
          user_id_feature_statistic_type: { user_id: userId, feature: RECORD_TYPE, statistic_type: rating },
        },
        create: { user_id: userId, feature: RECORD_TYPE, statistic_type: rating, statistic_count: 1 },
        update: { statistic_count: { increment: 1 } },
      }),
      ...(oldRating && oldRating !== rating ? [
        prisma.user_feature_statistics.update({
          where: {
            user_id_feature_statistic_type: { user_id: userId, feature: RECORD_TYPE, statistic_type: oldRating },
          },
          data: { statistic_count: { decrement: 1 } },
        }),
      ] : []),
    ]

    await prisma.$transaction([reviewStateOp, nodeProgressOp, ...featureStatsOps])
  }
}
