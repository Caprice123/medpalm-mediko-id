import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ALL_FEATURES } from './getUserFeatureSubscriptionsService.js'

/**
 * Bulk-set feature access for a user (admin manual override, permanent/no expiry).
 * - Features in activeFeatures with no current active row → insert a permanent row.
 * - Features NOT in activeFeatures → expire all active rows immediately.
 */
export class UpdateUserFeatureSubscriptionsService extends BaseService {
  static async call(userId, activeFeatures) {
    const activeSet = new Set(activeFeatures.filter(f => ALL_FEATURES.includes(f)))
    const now = new Date()

    await Promise.all(
      ALL_FEATURES.map(async feature => {
        if (activeSet.has(feature)) {
          // Ensure at least one active permanent row exists
          const existing = await prisma.user_feature_subscriptions.findFirst({
            where: {
              user_id: userId,
              feature,
              start_date: { lte: now },
              end_date: { gte: now },
            },
          })
          if (!existing) {
            await prisma.user_feature_subscriptions.create({
              data: { user_id: userId, feature, start_date: now, end_date: null },
            })
          }
        } else {
          // Expire all active rows for this feature
          await prisma.user_feature_subscriptions.updateMany({
            where: {
              user_id: userId,
              feature,
              start_date: { lte: now },
              end_date: { gte: now },
            },
            data: { end_date: now, updated_at: now },
          })
        }
      })
    )

    // Return summary
    const rows = await prisma.user_feature_subscriptions.findMany({
      where: {
        user_id: userId,
        start_date: { lte: now },
        end_date: { gte: now },
      },
    })

    const activeNow = new Set(rows.map(r => r.feature))
    return ALL_FEATURES.map(feature => ({ feature, isActive: activeNow.has(feature) }))
  }
}
