import moment from 'moment'
import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ALL_FEATURES } from './getUserFeatureSubscriptionsService.js'
import { ValidationError } from '#errors/validationError'

export class CreateFeatureSubscriptionService extends BaseService {
  static async call({ userId, feature, startDate, endDate }) {
    if (!userId) throw new ValidationError('userId is required')
    if (!ALL_FEATURES.includes(feature)) {
      throw new ValidationError(`Invalid feature: ${feature}`)
    }
    if (!endDate) throw new ValidationError('endDate is required')

    const now = new Date()

    // If there's an existing active/future subscription, extend from its end date
    const lastActive = await prisma.user_feature_subscriptions.findFirst({
      where: { user_id: userId, feature, end_date: { gte: now } },
      orderBy: { end_date: 'desc' },
    })

    const effectiveStartDate = lastActive
      ? moment(lastActive.end_date).add(1, 'day').startOf('day').toDate()
      : moment(startDate || now).startOf('day').toDate()

    const effectiveEndDate = moment(endDate).startOf('day').toDate()

    const row = await prisma.user_feature_subscriptions.create({
      data: {
        user_id: userId,
        feature,
        start_date: effectiveStartDate,
        end_date: effectiveEndDate,
      },
      include: { user: { select: { id: true, name: true, email: true } } },
    })

    return {
      id: row.id,
      userId: row.user_id,
      feature: row.feature,
      startDate: row.start_date,
      endDate: row.end_date,
      isActive: row.start_date <= now && row.end_date >= now,
      createdAt: row.created_at,
      user: row.user ? { id: row.user.id, name: row.user.name, email: row.user.email } : null,
    }
  }
}
