import { DateTime } from 'luxon'

// How many seconds a session still has on its clock.
//
// A started session is measured against `scheduled_end_at`, which is what the bell actually
// fires on; a session that was created but never started still has its whole allocation, which
// only the topic snapshot knows. Anything else (completed, or a started session with no
// scheduled end) has no clock left to show.
//
// The same rule already lives inline in the V1 session serializer. It is restated here rather
// than imported because V1 is immutable, and the hub needs it for a list of sessions it never
// serializes one at a time.
export const remainingSecondsFor = (session, durationMinutes) => {
  if (session.status === 'started' && session.scheduled_end_at) {
    const now = DateTime.now().setZone('Asia/Jakarta')
    const scheduledEnd = DateTime
      .fromJSDate(session.scheduled_end_at, { zone: 'utc' })
      .setZone('Asia/Jakarta')

    return Math.max(0, Math.floor(scheduledEnd.diff(now, 'seconds').seconds))
  }

  if (session.status === 'created') {
    return (durationMinutes || 0) * 60
  }

  return 0
}

// A started session whose scheduled end has already passed is finished in every way that
// matters to the student, but its row still says `started` until the evaluation runs. The hub
// shows it as its own state rather than offering "Lanjutkan" on a clock reading 00:00.
export const isExpired = (session, durationMinutes) =>
  session.status === 'started' && remainingSecondsFor(session, durationMinutes) === 0

// Raw rubric points are not comparable between stations — `max_score` follows each station's
// own rubric — so every score the hub shows is a percentage of the rubric it was marked
// against. Returns null for a session that was never scored.
export const scorePercentage = (totalScore, maxScore) => {
  if (totalScore === null || totalScore === undefined) return null
  if (!maxScore) return null

  return (totalScore / maxScore) * 100
}
