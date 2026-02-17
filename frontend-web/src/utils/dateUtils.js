import moment from 'moment-timezone'

const LOCAL_TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone

/**
 * Formats an ISO8601 string into the user's local timezone.
 * @param {string} isoString
 * @param {string} format - moment format string
 * @returns {string}
 */
export const formatLocalDate = (isoString, format = 'D MMM YYYY') => {
  if (!isoString) return '-'
  return moment(isoString).tz(LOCAL_TIMEZONE).format(format)
}

/**
 * Formats an ISO8601 string with time into the user's local timezone.
 * @param {string} isoString
 * @returns {string}
 */
export const formatLocalDateTime = (isoString) => {
  return formatLocalDate(isoString, 'D MMM YYYY, HH:mm')
}

/**
 * Formats an ISO8601 string with long month name into the user's local timezone.
 * e.g. "18 Februari 2026"
 * @param {string} isoString
 * @returns {string}
 */
export const formatLocalDateLong = (isoString) => {
  return formatLocalDate(isoString, 'D MMMM YYYY')
}

/**
 * Formats an ISO8601 string with full weekday + date + time into the user's local timezone.
 * e.g. "Rabu, 18 Feb 2026, 14:30"
 * @param {string} isoString
 * @returns {string}
 */
export const formatLocalDateTimeFull = (isoString) => {
  return formatLocalDate(isoString, 'dddd, D MMM YYYY, HH:mm')
}

/**
 * Formats an ISO8601 string to time only (HH:mm) in the user's local timezone.
 * @param {string} isoString
 * @returns {string}
 */
export const formatLocalTime = (isoString) => {
  return formatLocalDate(isoString, 'HH:mm')
}

/**
 * Returns a relative time string (e.g. "5 menit yang lalu") using moment,
 * falling back to "D MMM" for dates older than 7 days.
 * @param {string} isoString
 * @returns {string}
 */
export const formatRelativeTime = (isoString) => {
  if (!isoString) return '-'
  const date = moment(isoString).tz(LOCAL_TIMEZONE)
  const diffMinutes = moment().diff(date, 'minutes')
  if (diffMinutes < 1) return 'Baru saja'
  if (diffMinutes < 60) return `${diffMinutes}m yang lalu`
  const diffHours = moment().diff(date, 'hours')
  if (diffHours < 24) return `${diffHours}j yang lalu`
  const diffDays = moment().diff(date, 'days')
  if (diffDays < 7) return `${diffDays}h yang lalu`
  return date.format('D MMM')
}

export const formatToJakarta = (date) => {
    return date?.toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" })
};

export const formatDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
}
