import { toJakartaISO } from '#utils/dateUtils'

// Shapes the public landing-page statistics response.
//
// The ticker carries one entry per feature that actually has content; entries
// whose count is zero are dropped here rather than in the UI, so the frontend
// never has to decide what is worth showing. The trust card rolls the same
// numbers into three headline figures.
export const serializeHomeStats = (stats) => {
  // The Latihan (exercise) feature is switched off — `exercise_is_active` is
  // false and it holds a single topic from 2025 — so its 15 questions are
  // counted but never advertised. Its counter stays wired up in the services,
  // ready if the feature is ever turned back on.
  const ticker = [
    { key: 'mcq', label: 'Soal MCQ', count: stats.mcqCount },
    { key: 'flashcard', label: 'Flashcard', count: stats.flashcardBasicCount },
    { key: 'cloze', label: 'Fill in the Blank', count: stats.flashcardClozeCount },
    { key: 'diagnostic', label: 'Soal Diagnostik', count: stats.diagnosticCount },
    { key: 'atlas', label: 'Model Anatomi 3D', count: stats.atlas3dCount },
    { key: 'summaryNote', label: 'Ringkasan Materi', count: stats.summaryNoteCount },
    { key: 'anatomy', label: 'Soal Anatomi', count: stats.anatomyCount },
  ].filter((item) => item.count > 0)

  return {
    ticker,
    trust: {
      memberCount: stats.memberCount,
      // Everything a student practises on, across the live features. Flashcards
      // belong here rather than with the reading material: they are a recall
      // drill, and they are the largest content type on the platform — leaving
      // them out halved the headline figure.
      practiceCount:
        stats.mcqCount +
        stats.diagnosticCount +
        stats.anatomyCount +
        stats.flashcardBasicCount +
        stats.flashcardClozeCount,
      // Everything a student reads or explores.
      materialCount: stats.summaryNoteCount + stats.atlas3dCount,
    },
    generatedAt: toJakartaISO(stats.generatedAt),
  }
}
