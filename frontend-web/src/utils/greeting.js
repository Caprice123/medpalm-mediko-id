import moment from 'moment-timezone'

const LOCAL_TIMEZONE = 'Asia/Jakarta'

/**
 * Time-of-day salutation in Indonesian, read in Jakarta time.
 *
 * Shared so the app greets a student the same way wherever they land. The
 * Dashboard and the Topic hub each used to carry their own greeting — one
 * Indonesian, one English ("Hi,"), with different fallback names — so moving
 * between the two said hello twice, in two languages.
 *
 * Jakarta time rather than the browser clock: a student travelling or on a
 * device with a wrong timezone should still be told good morning when it is
 * morning for the curriculum they are studying.
 */
export const getGreeting = () => {
  const hour = moment().tz(LOCAL_TIMEZONE).hour()
  if (hour >= 4 && hour < 12) return 'Selamat pagi'
  if (hour >= 12 && hour < 15) return 'Selamat siang'
  if (hour >= 15 && hour < 18) return 'Selamat sore'
  return 'Selamat malam'
}

/**
 * First name only, falling back to a friendly stand-in. The two surfaces used
 * to disagree here too ('Sobat' on the Dashboard, 'Dokter Muda' on the Topic
 * hub); 'Dokter Muda' wins because it is the one that knows who it is talking
 * to.
 */
export const getFirstName = (name) => name?.trim()?.split(' ')[0] || 'Dokter Muda'
