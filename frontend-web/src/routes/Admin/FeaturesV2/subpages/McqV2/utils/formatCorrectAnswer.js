// The question form lets an admin add options without an upper bound (two is the minimum),
// so the option letter is derived from its index rather than read off a fixed A–D list — an
// answer at E or beyond used to find no label and render as the em dash, which reads as
// "this question has no correct answer".
export const formatCorrectAnswer = (question) => {
  const { correctIndex, options } = question
  const option = options?.[correctIndex]
  if (correctIndex == null || option == null) return '—'
  return `${String.fromCharCode(65 + correctIndex)}: ${option}`
}
