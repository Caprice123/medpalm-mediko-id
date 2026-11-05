// TipTap always serialises an "empty" document as a single empty paragraph, so a plain
// falsy check is not enough to tell whether an admin actually wrote anything.
const EMPTY_HTML_PATTERNS = ['<p></p>', '<p><br></p>', '<p><br/></p>', '<p><br /></p>']

export const isRichTextEmpty = (html) => {
  if (!html) return true
  const trimmed = String(html).trim()
  if (!trimmed) return true
  if (EMPTY_HTML_PATTERNS.includes(trimmed)) return true
  // Strip tags and non-breaking spaces: a document holding only formatting is still empty
  return trimmed.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim().length === 0
}

/** Returns the html as-is, or null when it carries no content — what the API should store. */
export const normalizeRichText = (html) => (isRichTextEmpty(html) ? null : String(html).trim())
