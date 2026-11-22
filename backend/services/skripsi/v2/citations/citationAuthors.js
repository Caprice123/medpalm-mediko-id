// Authors are stored as [{ family, given }] because every style prints a name
// differently. The edit form, though, is one text field — a student fixing a
// WHO guideline should type "World Health Organization", not fill in two boxes
// per author — so this is the one place that reads that field and writes it
// back out.

// One author per semicolon. Three shapes are understood, in this order:
//
//   "Guzman, Maria G"  → family "Guzman", given "Maria G"   (comma is explicit)
//   "Guzman MG"        → family "Guzman", given "MG"        (Vancouver input)
//   "World Health Organization" → an institution, kept whole
//
// A name with several words and no trailing initials is treated as an
// institution rather than guessed at: shortening "Kementerian Kesehatan RI" to
// initials would be worse than leaving it alone.
export const parseAuthorsInput = (text) => String(text ?? '')
  .split(';')
  .map(part => part.trim())
  .filter(Boolean)
  .map((part) => {
    if (part.includes(',')) {
      const [family, ...rest] = part.split(',')
      return { family: family.trim(), given: rest.join(',').trim() }
    }

    const initialsMatch = /^(.*?)\s+([A-Z]{1,3})$/.exec(part)
    if (initialsMatch) {
      return { family: initialsMatch[1].trim(), given: initialsMatch[2] }
    }

    return { family: part, given: '' }
  })
  .filter(author => author.family)

// The same list as the form shows it, so an edit round-trips to the same text
// it was opened with.
export const authorsToText = (authors) => (Array.isArray(authors) ? authors : [])
  .filter(author => author && author.family)
  .map(author => (author.given ? `${author.family}, ${author.given}` : author.family))
  .join('; ')
