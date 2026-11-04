// Splits a string into matched/unmatched runs so a search result can mark the part
// the reader actually typed. Returns plain data, not markup — rendering <mark> is
// the component's job.

const ESCAPE_PATTERN = /[.*+?^${}()|[\]\\]/g

export function splitMatches(text, query) {
  const haystack = text || ''
  const needle = (query || '').trim()
  if (!needle) return [{ text: haystack, isMatch: false }]

  const pattern = new RegExp(`(${needle.replace(ESCAPE_PATTERN, '\\$&')})`, 'gi')
  return haystack
    .split(pattern)
    .filter(segment => segment !== '')
    .map(segment => ({ text: segment, isMatch: segment.toLowerCase() === needle.toLowerCase() }))
}
