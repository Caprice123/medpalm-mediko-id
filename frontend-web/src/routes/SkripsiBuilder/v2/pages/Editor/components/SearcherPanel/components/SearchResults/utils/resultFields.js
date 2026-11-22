import { formatJakartaDateLong } from '@utils/dateUtils'

// How much of a snippet is shown before it has to be asked for. Perplexity
// returns a page's worth of text per result, and twenty of those at once turned
// the results list into a wall nobody reads.
export const SNIPPET_LIMIT = 280

// Perplexity dates arrive as plain yyyy-mm-dd, which the Jakarta formatter
// reads fine; anything it cannot parse is left out rather than shown as
// "Invalid date".
export const readableDate = (value) => {
  if (!value) return null

  const formatted = formatJakartaDateLong(value)
  return formatted && !formatted.toLowerCase().includes('invalid') ? formatted : null
}

export const hostnameOf = (url) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

// The year a source is cited by. A result without a publication date still
// carries `last_updated`, so the year is taken from that instead and marked as
// the weaker of the two rather than passed off as the publication year.
export const publishYear = (result) => {
  const year = (value) => {
    const match = /^(\d{4})/.exec(String(value ?? ''))
    return match ? match[1] : null
  }

  const published = year(result.date)
  if (published) return { year: published, isPublished: true }

  const updated = year(result.lastUpdated)
  return updated ? { year: updated, isPublished: false } : null
}

// Cut at the last space before the limit, so the break never lands mid-word.
export const clampSnippet = (snippet) => {
  const text = snippet ?? ''
  if (text.length <= SNIPPET_LIMIT) return { text, isClamped: false }

  const cut = text.slice(0, SNIPPET_LIMIT)
  const lastSpace = cut.lastIndexOf(' ')

  return { text: `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`, isClamped: true }
}
