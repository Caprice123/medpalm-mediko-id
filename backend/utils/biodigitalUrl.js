/**
 * Normalises BioDigital embed URLs before they are stored.
 *
 * Two things go wrong with these URLs in practice:
 *
 * 1. Whitespace gets pasted into them. A URL copied through a chat client or a wrapped document
 *    can arrive as `ui-help=f%20%20alse`; BioDigital then reads an unknown value and silently
 *    falls back to its default, so the embed looks "ignored" rather than broken.
 * 2. Authors paste whatever the Share dialog emitted, which leaves viewer chrome we do not want
 *    on by default.
 *
 * Only BioDigital URLs are touched — an embed_url column may legitimately hold Sketchfab or any
 * other provider, and those are returned trimmed but otherwise untouched.
 */

const BIODIGITAL_HOST = /^https?:\/\/[a-z0-9.-]*biodigital\.com\//i

// The viewer only honours ui-* switches on its player paths; /studio/edit and /login are not
// embeddable at all, and pinning params onto them would dress up a URL that still cannot work.
const PLAYER_PATH = /biodigital\.com\/(viewer\/|view)\?/i

// A URL as it appears inside BlockNote JSON or markdown: it ends at a quote, a markdown link's
// closing paren, angle brackets or whitespace.
const BIODIGITAL_URL_IN_TEXT = /https?:\/\/[a-z0-9.-]*biodigital\.com\/[^\s"'<>\\)]*/gi

/**
 * Params pinned on every stored BioDigital embed, whatever the Share dialog emitted.
 * Add an entry here to roll a setting out across new and backfilled data alike.
 */
export const ENFORCED_PARAMS = {
  'ui-help': 'false',
}

// Whitespace is never valid inside a URL, in either its literal or percent-encoded form.
const stripWhitespace = (url) => url.replace(/\s+/g, '').replace(/%(?:20|09|0a|0d)/gi, '')

function enforceParams(url) {
  if (!PLAYER_PATH.test(url)) return url
  let out = url
  for (const [key, value] of Object.entries(ENFORCED_PARAMS)) {
    const existing = new RegExp(`([?&]${key}=)[^&#]*`, 'i')
    out = existing.test(out)
      ? out.replace(existing, `$1${value}`)
      : `${out}${out.includes('?') ? '&' : '?'}${key}=${value}`
  }
  return out
}

/** Normalise a single embed URL as typed into an admin form. */
export function sanitizeEmbedUrl(raw) {
  if (typeof raw !== 'string') return raw
  const trimmed = raw.trim()
  if (!BIODIGITAL_HOST.test(trimmed)) return trimmed
  return enforceParams(stripWhitespace(trimmed))
}

/** Normalise every BioDigital URL embedded in a blob of text (BlockNote JSON, markdown). */
export function sanitizeEmbedUrlsInText(text) {
  if (typeof text !== 'string') return text
  return text.replace(BIODIGITAL_URL_IN_TEXT, (url) => enforceParams(stripWhitespace(url)))
}

/** How many BioDigital URLs a blob of text would change — used by the backfill script's dry run. */
export function countChangedUrls(text) {
  if (typeof text !== 'string') return 0
  let changed = 0
  text.replace(BIODIGITAL_URL_IN_TEXT, (url) => {
    if (enforceParams(stripWhitespace(url)) !== url) changed++
    return url
  })
  return changed
}
