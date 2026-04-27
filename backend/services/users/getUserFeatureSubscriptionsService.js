import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export const ALL_FEATURES = [
  'exercise',
  'flashcard',
  'calculator',
  'diagnostic',
  'anatomy',
  'mcq',
  'chatbot',
  'skripsi',
  'oscePractice',
  'summaryNotes',
  'atlas',
]

/**
 * Get the feature subscription map for a user.
 * Returns an array of { feature, isActive } for all known features.
 * Missing rows are treated as inactive (not granted).
 */
export class GetUserFeatureSubscriptionsService extends BaseService {
  static async call(userId) {
    const rows = await prisma.user_feature_subscriptions.findMany({
      where: { user_id: userId },
    })

    const rowMap = Object.fromEntries(rows.map(r => [r.feature, r.is_active]))

    return ALL_FEATURES.map(feature => ({
      feature,
      isActive: rowMap[feature] ?? false,
    }))
  }
}

/**
 * Returns true if the user has an active feature subscription for the given feature key.
 */
export async function hasFeatureAccess(userId, featureKey) {
  const row = await prisma.user_feature_subscriptions.findUnique({
    where: { user_id_feature: { user_id: userId, feature: featureKey } },
  })
  return !!(row && row.is_active)
}
