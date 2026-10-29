import moment from 'moment-timezone'

// Calendar days between today and `iso`, counted in Jakarta time.
//
// Calendar days, not 24-hour blocks: something starting at 01.00 tomorrow is
// "besok" even though it is three hours away, and something starting at 23.00
// tonight is "hari ini" even though it is nearly a day off. Comparing from the
// start of each day is what makes both read correctly.
//
// Returns null when there is no date, and a negative number for a date that has
// already passed.
export function jakartaDaysUntil(iso) {
  if (!iso) return null

  const target = moment(iso).tz('Asia/Jakarta').startOf('day')
  const today = moment().tz('Asia/Jakarta').startOf('day')

  return target.diff(today, 'days')
}

// "Hari Ini" / "Besok" / "5 Hari Lagi" — the tail of a badge like
// "Mulai 5 Hari Lagi" or "Buka Besok", so it carries no verb of its own.
export function countdownLabel(iso) {
  const days = jakartaDaysUntil(iso)
  if (days === null) return null
  if (days <= 0) return 'Hari Ini'
  if (days === 1) return 'Besok'
  return `${days} Hari Lagi`
}
