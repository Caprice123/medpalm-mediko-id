export const CARD_TYPE_LABELS = {
  basic: 'Basic',
  cloze: 'Cloze',
  occlusion: 'Occlusion',
}

export function getCardFrontPreview(card) {
  if (card.type === 'cloze') return (card.front || '').replace(/\{\{\d+\}\}/g, '___')
  if (card.type === 'occlusion') return `Kartu Occlusion (${card.occlusionRegions?.length || 0} area)`
  return card.front
}
