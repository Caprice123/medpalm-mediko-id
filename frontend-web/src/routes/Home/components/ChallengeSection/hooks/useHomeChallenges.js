import { useSelector } from 'react-redux'
import { formatJakartaDateLong } from '@utils/dateUtils'
import { countdownLabel } from '../../../utils/countdown'

// Whole minutes: every challenge duration in the admin panel is set in minutes,
// so this only ever rounds a value that was already round.
const durationLabel = (seconds) => {
  if (!seconds) return '—'
  const minutes = Math.round(seconds / 60)
  return minutes >= 1 ? `${minutes} Menit` : `${seconds} Detik`
}

// Shapes the challenge listing into the fields the card renders.
//
// From GET /api/v1/challenges, which the landing page can read without a login.
// It holds two kinds of challenge at once: running now, and starting within the
// next week.
//
// The stat row differs between the two on purpose. A challenge that has not
// started has a participant count of zero, and "0 Peserta" on a card inviting
// you to join reads as nobody wants it — so an upcoming card shows its start
// date instead, and a running one shows when it ends and how many people are in
// it so far.
export function useHomeChallenges() {
  const challenges = useSelector((state) => state.home.challenges)

  const isLoaded = Array.isArray(challenges)
  const now = Date.now()

  const items = (challenges || []).map((challenge) => {
    const startsAt = challenge.startAt
    const isUpcoming = Boolean(startsAt) && new Date(startsAt).getTime() > now
    const duration = durationLabel(challenge.durationSeconds)

    return {
      uniqueId: challenge.uniqueId,
      title: challenge.title,
      description: challenge.description,
      status: isUpcoming ? `Mulai ${countdownLabel(startsAt)}` : 'Sedang Berlangsung',
      stats: isUpcoming
        ? [
            { label: 'Mulai', value: formatJakartaDateLong(startsAt) },
            { label: 'Durasi', value: duration },
            // `challenges` has no cost column — none of them are paid — so the
            // third figure is the question count rather than an invented price.
            { label: 'Soal', value: challenge.totalQuestions ?? challenge.poolSize ?? 0 },
          ]
        : [
            {
              label: 'Berakhir',
              value: challenge.endAt ? formatJakartaDateLong(challenge.endAt) : 'Tanpa Batas',
            },
            { label: 'Peserta', value: challenge.playedCount ?? 0 },
            { label: 'Durasi', value: duration },
          ],
    }
  })

  return { items, isLoaded }
}
