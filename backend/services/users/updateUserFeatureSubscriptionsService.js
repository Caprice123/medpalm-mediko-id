import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ALL_FEATURES } from './getUserFeatureSubscriptionsService.js'

/**
 * Bulk-update feature subscriptions for a user.
 *
 * @param {number} userId
 * @param {string[]} activeFeatures - Array of feature keys that should be active.
 *   Any known feature not in this array will be set to inactive.
 */
export class UpdateUserFeatureSubscriptionsService extends BaseService {
  static async call(userId, activeFeatures) {
    const activeSet = new Set(activeFeatures.filter(f => ALL_FEATURES.includes(f)))

    await Promise.all(
      ALL_FEATURES.map(feature =>
        prisma.user_feature_subscriptions.upsert({
          where: { user_id_feature: { user_id: userId, feature } },
          create: { user_id: userId, feature, is_active: activeSet.has(feature) },
          update: { is_active: activeSet.has(feature), updated_at: new Date() },
        })
      )
    )

    return ALL_FEATURES.map(feature => ({
      feature,
      isActive: activeSet.has(feature),
    }))
  }
}
