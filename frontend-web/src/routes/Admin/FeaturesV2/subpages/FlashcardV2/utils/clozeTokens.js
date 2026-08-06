const CLOZE_TOKEN_REGEX = /\{\{(\d+)\}\}/g

export function referencedClozeNumbers(text) {
  const numbers = new Set()
  let match
  CLOZE_TOKEN_REGEX.lastIndex = 0
  while ((match = CLOZE_TOKEN_REGEX.exec(text || '')) !== null) {
    numbers.add(parseInt(match[1]))
  }
  return [...numbers].sort((a, b) => a - b)
}
