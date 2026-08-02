export const DIFFICULTY_LABELS = { easy: 'Mudah', medium: 'Sedang', hard: 'Sulit' }

export const CLASSIFICATION_LABELS = {
  fisiologi: 'Fisiologi',
  patologi: 'Patologi',
  sistem_blok: 'Sistem Blok',
  ilmu_lintas_sistem: 'Ilmu Lintas Sistem',
}

export function canUseFeature(sessionType, features, userStatus) {
  const feature = features.find(f => f.sessionType === sessionType)
  if (!feature || feature.accessType === 'free') return true
  const activeFeatureKeys = userStatus?.activeFeatureKeys || []
  return activeFeatureKeys.some(f => f.feature === sessionType)
}
