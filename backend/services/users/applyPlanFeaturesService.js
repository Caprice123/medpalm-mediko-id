import { ALL_FEATURES } from './getUserFeatureSubscriptionsService.js'

/**
 * Grant feature access defined in a pricing plan to a user.
 * Must be called with a Prisma transaction client.
 *
 * @param {object} tx - Prisma transaction client
 * @param {number} userId
 * @param {string[]} allowedFeatures - feature keys from the plan's allowed_features field
 */
export async function applyPlanFeatures(tx, userId, allowedFeatures) {
  if (!Array.isArray(allowedFeatures) || allowedFeatures.length === 0) return

  const features = allowedFeatures.filter(f => ALL_FEATURES.includes(f))
  if (features.length === 0) return

  await Promise.all(
    features.map(feature =>
      tx.user_feature_subscriptions.upsert({
        where: { user_id_feature: { user_id: userId, feature } },
        create: { user_id: userId, feature, is_active: true },
        update: { is_active: true, updated_at: new Date() },
      })
    )
  )
}
