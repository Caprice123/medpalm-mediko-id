import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import { computeNextReview } from './srsAlgorithm.js'

const VALID_RATINGS = ['again', 'hard', 'good', 'easy']

export class SubmitUserReviewStateService extends BaseService {
  static async call({ userId, recordType, recordId, rating }) {
    if (!VALID_RATINGS.includes(rating)) {
      throw new ValidationError('Rating tidak valid')
    }

    const existing = await prisma.user_review_states.findUnique({
      where: { user_id_record_type_record_id: { user_id: userId, record_type: recordType, record_id: recordId } },
    })

    const { interval, easeFactor, dueDate } = computeNextReview({
      interval: existing?.interval ?? 1,
      easeFactor: existing?.ease_factor ?? 2.5,
      rating,
    })

    return prisma.user_review_states.upsert({
      where: { user_id_record_type_record_id: { user_id: userId, record_type: recordType, record_id: recordId } },
      create: {
        user_id: userId,
        record_type: recordType,
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
  }
}
