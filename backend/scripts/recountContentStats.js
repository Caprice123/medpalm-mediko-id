import prisma from '#prisma/client'
import { CONTENT_STAT_KEYS } from '#utils/contentStatsHelper'

// Recomputes every landing-page counter from its source table.
//
// Two jobs:
//   1. Backfill — creates the constant rows the first time, before the
//      increment/decrement calls in the services have anything to adjust.
//   2. Repair — the counters are maintained by hand, so any write path that
//      forgets to adjust one (a seed, a bulk import, direct SQL) leaves it
//      permanently wrong. This is the only way back to the truth.
//
// Safe to run at any time: it overwrites each counter with a fresh count.
//
//   node scripts/recountContentStats.js

const definitions = [
  {
    key: CONTENT_STAT_KEYS.mcqQuestion,
    label: 'Soal MCQ',
    count: () => prisma.mcq_questions.count({ where: { deleted_at: null } }),
  },
  {
    key: CONTENT_STAT_KEYS.flashcardBasic,
    label: 'Flashcard (basic)',
    count: () => prisma.flashcard_cards.count({ where: { type: 'basic' } }),
  },
  {
    key: CONTENT_STAT_KEYS.flashcardCloze,
    label: 'Fill in the Blank (cloze)',
    count: () => prisma.flashcard_cards.count({ where: { type: 'cloze' } }),
  },
  {
    key: CONTENT_STAT_KEYS.summaryNote,
    label: 'Ringkasan Materi',
    count: () =>
      prisma.summary_notes.count({ where: { status: 'published', deleted_at: null } }),
  },
  {
    key: CONTENT_STAT_KEYS.atlasModel,
    label: 'Model Anatomi 3D',
    count: () =>
      prisma.atlas_models.count({ where: { status: 'published', deleted_at: null } }),
  },
  {
    key: CONTENT_STAT_KEYS.diagnosticQuestion,
    label: 'Soal Diagnostik',
    count: () => prisma.diagnostic_questions.count({ where: { deleted_at: null } }),
  },
  {
    key: CONTENT_STAT_KEYS.exerciseQuestion,
    label: 'Latihan',
    count: () => prisma.exercise_questions.count(),
  },
  {
    key: CONTENT_STAT_KEYS.anatomyQuestion,
    label: 'Soal Anatomi',
    count: () => prisma.anatomy_questions.count(),
  },
  {
    key: CONTENT_STAT_KEYS.member,
    label: 'Member tergabung',
    count: () => prisma.users.count({ where: { is_active: true } }),
  },
]

async function recountContentStats() {
  console.log('Recounting landing page content stats...\n')

  for (const definition of definitions) {
    const actual = await definition.count()

    const existing = await prisma.constants.findUnique({
      where: { key: definition.key },
      select: { value: true },
    })
    const before = existing ? Number(existing.value) : null

    await prisma.constants.upsert({
      where: { key: definition.key },
      update: { value: String(actual) },
      create: { key: definition.key, value: String(actual) },
    })

    const drift = before === null ? null : actual - before
    const note =
      before === null
        ? '(baru dibuat)'
        : drift === 0
          ? '(sudah tepat)'
          : `(meleset ${drift > 0 ? '+' : ''}${drift})`

    console.log(`${definition.label.padEnd(26)} ${String(actual).padStart(7)}  ${note}`)
  }

  console.log('\nSelesai.')
}

recountContentStats()
  .then(async () => {
    await prisma.$disconnect()
    process.exit(0)
  })
  .catch(async (error) => {
    console.error('Gagal menghitung ulang statistik:', error)
    await prisma.$disconnect()
    process.exit(1)
  })
