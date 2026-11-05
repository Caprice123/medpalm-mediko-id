/* Topic and sub-topic icons are a single emoji, but the admin field is free text
   and older records can carry several ("🫀💓"). Most emoji span more than one
   code unit (flags, skin tones, ZWJ sequences), so the string is cut by grapheme
   — slicing by index would hand back half a surrogate pair. */
function graphemes(value) {
  const trimmed = (value ?? '').trim()
  if (!trimmed) return []

  if (typeof Intl !== 'undefined' && typeof Intl.Segmenter === 'function') {
    return [...new Intl.Segmenter('id', { granularity: 'grapheme' }).segment(trimmed)].map(s => s.segment)
  }

  // Older browsers: a code-point split, which still keeps a surrogate pair whole.
  return [...trimmed]
}

/* For display: the first emoji of whatever is stored, so a record saved with
   several still shows as one mark. */
export function firstIcon(value) {
  return graphemes(value)[0] ?? null
}

/* For the admin input: the last emoji, so typing one next to the existing icon
   replaces it. Clamping to the first instead would look like a dead field —
   the keystroke would register and nothing on screen would change. */
export function lastIcon(value) {
  const parts = graphemes(value)
  return parts[parts.length - 1] ?? null
}
