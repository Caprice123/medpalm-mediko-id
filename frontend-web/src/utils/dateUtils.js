import moment from 'moment-timezone'
import 'moment/locale/id'

moment.locale('id')

const LOCAL_TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone

/**
 * Formats an ISO8601 string into the user's local timezone.
 * @param {string} isoString
 * @param {string} format - moment format string
 * @returns {string}
 */
export const formatLocalDate = (isoString) => {
  if (!isoString) return '-'
  const parts = new Intl.DateTimeFormat('id-ID', {
    timeZone: LOCAL_TIMEZONE, day: 'numeric', month: 'short', year: 'numeric',
  }).formatToParts(new Date(isoString))
  const get = (type) => parts.find(p => p.type === type)?.value ?? ''
  return `${get('day')} ${get('month')} ${get('year')}`
}

/**
 * Formats an ISO8601 string with time into the user's local timezone.
 * @param {string} isoString
 * @returns {string}
 */
export const formatLocalDateTime = (isoString) => {
  if (!isoString) return '-'
  return moment(isoString).locale('id').tz(LOCAL_TIMEZONE).format('D MMM YYYY, HH:mm')
}

export const formatLocalDateLong = (isoString) => {
  if (!isoString) return '-'
  return moment(isoString).locale('id').tz(LOCAL_TIMEZONE).format('D MMMM YYYY')
}

export const formatLocalDateTimeFull = (isoString) => {
  if (!isoString) return '-'
  return moment(isoString).locale('id').tz(LOCAL_TIMEZONE).format('dddd, D MMM YYYY, HH:mm')
}

export const formatLocalTime = (isoString) => {
  if (!isoString) return '-'
  return moment(isoString).locale('id').tz(LOCAL_TIMEZONE).format('HH:mm')
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
}

const JAKARTA_TZ = 'Asia/Jakarta'

const jakartaParts = (isoString, options) => {
  const date = new Date(isoString)
  return new Intl.DateTimeFormat('id-ID', { timeZone: JAKARTA_TZ, ...options }).formatToParts(date)
}
const getPart = (parts, type) => parts.find(p => p.type === type)?.value ?? ''

export const formatJakartaDateTimeFull = (isoString) => {
  if (!isoString) return '-'
  const parts = jakartaParts(isoString, {
    weekday: 'long', day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: false,
  })
  return `${getPart(parts, 'weekday')}, ${getPart(parts, 'day')} ${getPart(parts, 'month')} ${getPart(parts, 'year')}, ${getPart(parts, 'hour')}.${getPart(parts, 'minute')} WIB`
}

export const formatJakartaDateLong = (isoString) => {
  if (!isoString) return '-'
  const parts = jakartaParts(isoString, { day: 'numeric', month: 'long', year: 'numeric' })
  return `${getPart(parts, 'day')} ${getPart(parts, 'month')} ${getPart(parts, 'year')}`
}


export const formatDate = (dateString) => {
    return formatLocalDate(dateString)
}

export const toJakartaInputValue = (isoString) => {
  if (!isoString) return ''
  return moment(isoString).tz('Asia/Jakarta').format('YYYY-MM-DDTHH:mm')
}
