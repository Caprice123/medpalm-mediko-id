export const CLASSIFICATION_LABELS = {
  fisiologi: 'Fisiologi',
  patologi: 'Patologi',
  sistem_blok: 'Sistem Blok',
  ilmu_lintas_sistem: 'Ilmu Lintas Sistem',
}

export const DIFFICULTY_LABELS = { easy: 'Mudah', medium: 'Sedang', hard: 'Sulit' }

export function classificationLabel(val) {
  if (!val) return null
  return CLASSIFICATION_LABELS[val.toLowerCase()] ?? val
}

export function classificationType(val) {
  if (!val) return 'default'
  return val.toLowerCase() === 'patologi' ? 'patologi' : 'fisiologi'
}
