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
  'skripsi_builder',
  'osce_practice',
  'summary_notes',
  'atlas',
]

/**
 * Returns true if the user has any active, non-expired feature subscription for the given feature.
 */
export async function hasFeatureAccess(userId, featureKey) {
  const now = new Date()
  const row = await prisma.user_feature_subscriptions.findFirst({
    where: {
      user_id: userId,
      feature: featureKey,
      start_date: { lte: now },
      end_date: { gte: now },
    },
  })
  return !!row
}
