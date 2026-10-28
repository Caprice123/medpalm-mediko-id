import prisma from '#prisma/client'

// Denormalised content counters for the public landing page, stored as rows in
// `constants`. Follows the same shape as nodeStatisticsHelper: a `bump` that
// takes a client so it can join a transaction, plus increment/decrement
// wrappers for the common case.
//
// These are maintained by the services that write content — every create,
// delete, soft-delete, restore and status change has to adjust them. A counter
// only ever drifts away from the truth, so `scripts/recountContentStats.js`
// rebuilds them all from the source tables; run it after any bulk import, seed
// or direct SQL change.
export const CONTENT_STAT_KEYS = {
  mcqQuestion: 'stat_mcq_question_count',
  flashcardBasic: 'stat_flashcard_basic_count',
  flashcardCloze: 'stat_flashcard_cloze_count',
  summaryNote: 'stat_summary_note_count',
  atlasModel: 'stat_atlas_model_count',
  diagnosticQuestion: 'stat_diagnostic_question_count',
  exerciseQuestion: 'stat_exercise_question_count',
  anatomyQuestion: 'stat_anatomy_question_count',
  member: 'stat_member_count',
}

/**
 * Adjust a counter by `delta`, atomically.
 *
 * `constants.value` is a text column, so the arithmetic runs in SQL rather than
 * read-modify-write in JS: two concurrent writers would otherwise read the same
 * value and one increment would be lost. GREATEST(..., 0) keeps a counter from
 * going negative if a decrement ever runs twice.
 *
 * Pass the transaction client when the content write happens inside
 * `$transaction`, so a rollback takes the counter with it.
 */
export async function bumpContentStat(client, key, delta) {
  if (!key || !delta) return

  await client.$executeRaw`
    UPDATE constants
    SET value = GREATEST(COALESCE(NULLIF(value, '')::bigint, 0) + ${delta}, 0)::text,
        updated_at = NOW()
    WHERE key = ${key}
  `
}

export const incrementContentStat = (key, delta = 1, client = prisma) =>
  bumpContentStat(client, key, delta)

export const decrementContentStat = (key, delta = 1, client = prisma) =>
  bumpContentStat(client, key, -delta)

/** Maps a flashcard card type to its counter; occlusion is not surfaced. */
export const flashcardStatKey = (type) => {
  if (type === 'basic') return CONTENT_STAT_KEYS.flashcardBasic
  if (type === 'cloze') return CONTENT_STAT_KEYS.flashcardCloze
  return null
}

/**
 * Summary notes and atlas models are only counted while published and not
 * deleted, so an update can cross the boundary in either direction without any
 * row being created or removed. Returns the delta to apply, or 0.
 */
export const publishedDelta = (before, after) => {
  const counted = (row) => Boolean(row) && row.status === 'published' && !row.deleted_at
  return Number(counted(after)) - Number(counted(before))
}
