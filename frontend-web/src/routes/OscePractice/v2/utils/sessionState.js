// Plain helpers shared by the board's rows and rail. No React, no Redux.

// The score bands the whole feature reads a result against: 75 is the mark a station is
// expected to clear, under 60 is a retry. Same cut-offs the performance chart has always used,
// restated here as CSS custom properties so a row, a bar and a chip cannot drift apart.
export const SCORE_BANDS = [
  { min: 75, color: 'var(--color-brand-green-darker)', label: '75+ aman' },
  { min: 60, color: 'var(--color-warning-text)', label: '60–74 cukup' },
  { min: 0, color: 'var(--color-danger-dark)', label: '< 60 perlu latihan' },
]

export const scoreBand = (percentage) =>
  SCORE_BANDS.find((band) => percentage >= band.min) || SCORE_BANDS[SCORE_BANDS.length - 1]

export const scoreColor = (percentage) =>
  percentage === null || percentage === undefined
    ? 'var(--color-gray-500)'
    : scoreBand(percentage).color

// The clock. Stations run 15–20 minutes, so hours are dead weight on screen; they appear only
// if a station is ever configured long enough to need them.
export const formatClock = (totalSeconds) => {
  const safe = Math.max(0, Math.floor(totalSeconds || 0))
  const hours = Math.floor(safe / 3600)
  const minutes = Math.floor((safe % 3600) / 60)
  const seconds = safe % 60
  const pad = (value) => String(value).padStart(2, '0')

  return hours > 0
    ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
    : `${pad(minutes)}:${pad(seconds)}`
}

// Time already spent, read in the history rows. Minutes are enough there — nobody compares
// attempts to the second after the fact.
export const formatDuration = (totalSeconds) => {
  if (!totalSeconds) return '—'
  const minutes = Math.round(totalSeconds / 60)

  return minutes < 60 ? `${minutes} menit` : `${Math.floor(minutes / 60)}j ${minutes % 60}m`
}

// Under 60s is critical, under 2.5 minutes is a warning. Same thresholds the V1 timer used, so
// a student who learned the colours does not have to relearn them.
export const clockUrgency = (remainingSeconds) => {
  if (remainingSeconds <= 0) return 'expired'
  if (remainingSeconds < 60) return 'critical'
  if (remainingSeconds < 150) return 'warning'

  return 'normal'
}

export const SESSION_STATE_LABELS = {
  created: 'Belum dimulai',
  started: 'Sedang berlangsung',
  completed: 'Selesai dinilai',
  expired: 'Waktu habis',
}

// What the row's action does, which depends only on the state.
export const SESSION_STATE_ACTIONS = {
  created: 'Mulai kerjakan',
  started: 'Lanjutkan',
  completed: 'Lihat hasil',
  expired: 'Lihat hasil',
}

const TOPIC_GROUP = 'topic'
const BATCH_GROUP = 'batch'

export const tagsInGroup = (tags, groupName) =>
  (tags || []).filter((tag) => tag.groupName === groupName)

export const topicTags = (tags) => tagsInGroup(tags, TOPIC_GROUP)
export const batchTags = (tags) => tagsInGroup(tags, BATCH_GROUP)

// The station row's own record line — the answer to "is this case worth my next fifteen
// minutes". Null means never attempted, which is itself the most useful thing a row can say.
export const recordSummary = (myRecord) => {
  if (!myRecord || myRecord.attemptCount === 0) {
    return { label: 'Belum pernah dicoba', tone: 'new', percentage: null }
  }

  const attempts = myRecord.attemptCount === 1 ? '1 percobaan' : `${myRecord.attemptCount} percobaan`

  return {
    label: `Skor terbaik ${Math.round(myRecord.bestPercentage)} · ${attempts}`,
    tone: 'scored',
    percentage: myRecord.bestPercentage,
  }
}

// How much of the rubric the student has actually touched, for the resumable session's
// empty-section marks. Observations are excluded: not every station has any.
export const worksheetSections = (progress) => [
  { key: 'conversation', label: 'Percakapan', filled: (progress?.messageCount || 0) > 0, detail: `${progress?.messageCount || 0} pesan` },
  { key: 'diagnosis', label: 'Diagnosis', filled: !!progress?.hasDiagnosis, detail: progress?.hasDiagnosis ? 'terisi' : 'masih kosong' },
  { key: 'therapy', label: 'Terapi', filled: !!progress?.hasTherapy, detail: progress?.hasTherapy ? 'terisi' : 'masih kosong' },
]

// Whether the station is still waiting on the patient's reply to even begin.
//
// The shared streaming action keeps `isSendingMessage` / `isAssistantTyping` raised for the
// whole character-by-character animation and only lowers them when the stream's `done` event
// lands. A stream that ends without one leaves both raised forever — which showed as a dots
// bubble stuck beside a finished answer, and worse, a composer the student could no longer
// type into. So "waiting" is defined by what is on screen: once the reply has any text, the
// turn is visibly under way and the student is no longer blocked.
export const isAwaitingReply = (messages, isAnswering) => {
  if (!isAnswering) return false

  const last = messages?.length ? messages[messages.length - 1] : null
  const replyHasText = !!last && !last.isUser && !!(last.content || last.text || '').trim()

  return !replyHasText
}
