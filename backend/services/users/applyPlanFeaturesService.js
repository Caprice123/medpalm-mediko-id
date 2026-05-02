import moment from 'moment'
import { ALL_FEATURES } from './getUserFeatureSubscriptionsService.js'

/**
 * Grant feature access from a pricing plan to a user.
 * Each feature gets its own start date based on its own last active subscription
 * (last end + 1 day, or today if none), and end date = start + durationDays.
 * Must be called inside a Prisma transaction.
 *
 * @param {object} tx - Prisma transaction client
 * @param {number} userId
 * @param {string[]} allowedFeatures - feature keys from the plan
 * @param {number} durationDays - how many days of access to grant
 */
export async function applyPlanFeatures(tx, userId, allowedFeatures, durationDays) {
  if (!Array.isArray(allowedFeatures) || allowedFeatures.length === 0) return
  if (!durationDays || durationDays <= 0) return

  const features = allowedFeatures.filter(f => ALL_FEATURES.includes(f))
  if (features.length === 0) return

  const now = new Date()

  await Promise.all(features.map(async feature => {
    const lastSub = await tx.user_feature_subscriptions.findFirst({
      where: { user_id: userId, feature, end_date: { gte: now } },
      orderBy: { end_date: 'desc' },
    })

    const startDate = lastSub
      ? moment(lastSub.end_date).add(1, 'day').startOf('day').toDate()
      : moment().startOf('day').toDate()

    const endDate = moment(startDate).add(durationDays, 'days').endOf('day').toDate()

    await tx.user_feature_subscriptions.create({
      data: { user_id: userId, feature, start_date: startDate, end_date: endDate },
    })
  }))
}
