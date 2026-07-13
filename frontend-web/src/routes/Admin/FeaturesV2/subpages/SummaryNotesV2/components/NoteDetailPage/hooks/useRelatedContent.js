export function useRelatedContent({ flashcardRelations, mcqRelations, add, remove }) {
  const linkedFlashcardIds = new Set(flashcardRelations.map(r => r.targetId))
  const linkedMcqIds = new Set(mcqRelations.map(r => r.targetId))
  const totalLinked = flashcardRelations.length + mcqRelations.length

  const handleToggleFlashcard = (item) => {
    const rel = flashcardRelations.find(r => r.targetId === item.id)
    if (rel) remove(rel.id)
    else add('flashcard_deck', item)
  }

  const handleToggleMcq = (item) => {
    const rel = mcqRelations.find(r => r.targetId === item.id)
    if (rel) remove(rel.id)
    else add('mcq_topic', item)
  }

  return { linkedFlashcardIds, linkedMcqIds, totalLinked, handleToggleFlashcard, handleToggleMcq }
}
