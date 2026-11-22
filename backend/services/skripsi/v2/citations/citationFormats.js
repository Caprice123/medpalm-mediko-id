// The four styles the daftar pustaka can be generated in, and the in-text
// marker each one uses. Formatting lives on the server so the list, the
// generated section and the marker a student copies can never disagree.
//
// Two families, and the difference decides the order and the marker — the
// daftar pustaka itself is a numbered list in every style:
//   - numeric (Vancouver, IEEE): entries stay in the order they were saved;
//     the marker is that entry's number.
//   - author-date (APA, Harvard): entries are sorted by author; the marker is
//     the author and the year.

export const CITATION_STYLES = ['vancouver', 'apa', 'harvard', 'ieee']
export const DEFAULT_CITATION_STYLE = 'vancouver'

export const CITATION_STYLE_LABELS = {
  vancouver: 'Vancouver',
  apa: 'APA 7',
  harvard: 'Harvard',
  ieee: 'IEEE',
}

const NUMERIC_STYLES = ['vancouver', 'ieee']

export const isNumericStyle = (style) => NUMERIC_STYLES.includes(style)

// Vancouver prints at most six authors before "et al."; APA 7 allows twenty but
// the convention in a student report is far shorter, so both are capped where
// the style says to.
const AUTHOR_LIMITS = { vancouver: 6, apa: 20, harvard: 3, ieee: 6 }

const initials = (given) => String(given ?? '')
  .split(/[\s.-]+/)
  .filter(Boolean)
  .map(part => part[0].toUpperCase())
  .join('')

// An institution is stored as one name with no given name ("World Health
// Organization"), and must never be shortened to initials.
const isInstitution = (author) => !author.given && /\s/.test(String(author.family ?? '').trim())

const authorList = (authors) => (Array.isArray(authors) ? authors : [])
  .filter(author => author && author.family)

const join = (parts, separator = ' ') => parts.filter(Boolean).join(separator)

// Vancouver/IEEE: "Rahman AB". APA/Harvard: "Rahman, A. B.". IEEE puts the
// initials first.
const formatAuthor = (author, style) => {
  if (isInstitution(author)) return author.family

  const family = author.family
  const short = initials(author.given)

  if (style === 'vancouver') return join([family, short])
  if (style === 'ieee') return join([short.split('').map(letter => `${letter}.`).join(' '), family])

  const dotted = short.split('').map(letter => `${letter}.`).join(' ')
  return dotted ? `${family}, ${dotted}` : family
}

const formatAuthors = (authors, style) => {
  const list = authorList(authors)
  if (list.length === 0) return ''

  const limit = AUTHOR_LIMITS[style] ?? 6
  const shown = list.slice(0, limit).map(author => formatAuthor(author, style))
  const truncated = list.length > limit

  if (style === 'vancouver') {
    return `${shown.join(', ')}${truncated ? ', et al' : ''}`
  }

  if (style === 'ieee') {
    if (truncated) return `${shown.join(', ')}, et al.`
    if (shown.length === 1) return shown[0]
    return `${shown.slice(0, -1).join(', ')} and ${shown[shown.length - 1]}`
  }

  if (style === 'harvard') {
    if (truncated) return `${shown[0]} et al.`
    if (shown.length === 1) return shown[0]
    return `${shown.slice(0, -1).join(', ')} and ${shown[shown.length - 1]}`
  }

  // APA 7: an ampersand before the last author, "et al." past the limit.
  if (truncated) return `${shown.slice(0, 19).join(', ')}, … ${shown[shown.length - 1]}`
  if (shown.length === 1) return shown[0]
  return `${shown.slice(0, -1).join(', ')}, & ${shown[shown.length - 1]}`
}

const withPeriod = (text) => {
  const trimmed = String(text ?? '').trim()
  if (!trimmed) return ''
  return /[.?!]$/.test(trimmed) ? trimmed : `${trimmed}.`
}

// "2026 Nov 22" for Vancouver, "22 November 2026" for the rest: the access date
// is only printed on a web entry, which is the one shape that needs it.
const VANCOUVER_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const INDONESIAN_MONTHS = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

const jakartaParts = (date) => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(new Date(date))
  const get = (type) => parts.find(part => part.type === type)?.value ?? ''

  return { year: get('year'), month: parseInt(get('month'), 10), day: parseInt(get('day'), 10) }
}

const accessedDate = (date, style) => {
  const { year, month, day } = jakartaParts(date || new Date())

  return style === 'vancouver'
    ? `${year} ${VANCOUVER_MONTHS[month - 1]} ${day}`
    : `${day} ${INDONESIAN_MONTHS[month - 1]} ${year}`
}

const pagesOf = (citation) => citation.pages || null

// ---------------------------------------------------------------- the entries

const vancouverEntry = (citation) => {
  const authors = formatAuthors(citation.authors, 'vancouver')
  const accessed = `[dikutip ${accessedDate(citation.accessedAt, 'vancouver')}]`

  if (citation.sourceType === 'journal') {
    const volume = join([
      citation.volume,
      citation.issue ? `(${citation.issue})` : '',
    ], '')
    const locator = join([
      citation.publishedYear,
      volume && `;${volume}`,
      pagesOf(citation) ? `:${pagesOf(citation)}` : '',
    ], '')

    return join([
      withPeriod(authors),
      withPeriod(citation.title),
      withPeriod(citation.containerTitle),
      withPeriod(locator),
      citation.doi ? `doi:${citation.doi}` : '',
    ], ' ').trim()
  }

  // "Geneva: WHO; 2009 [dikutip 2026 Nov 22]." — the publisher, the year and
  // the access date are one clause in Vancouver, not three sentences.
  const imprint = join([
    join([citation.publisher || citation.containerTitle, citation.publishedYear], '; '),
    accessed,
  ], ' ')

  return join([
    withPeriod(authors),
    `${citation.title} [Internet].`,
    withPeriod(imprint),
    `Tersedia di: ${citation.url}`,
  ], ' ').trim()
}

const apaEntry = (citation) => {
  const authors = formatAuthors(citation.authors, 'apa')
  const year = citation.publishedYear ? `(${citation.publishedYear}).` : '(n.d.).'

  // With no author, APA opens with the title and the title is not repeated.
  if (!authors) {
    return join([
      withPeriod(citation.title),
      year,
      withPeriod(citation.sourceType === 'journal' ? citation.containerTitle : citation.publisher || citation.containerTitle),
      citation.sourceType === 'journal' && citation.doi ? `https://doi.org/${citation.doi}` : citation.url,
    ], ' ').trim()
  }

  if (citation.sourceType === 'journal') {
    const volume = join([
      citation.volume ? `*${citation.volume}*` : '',
      citation.issue ? `(${citation.issue})` : '',
    ], '')
    const locator = join([volume, pagesOf(citation)], ', ')

    return join([
      withPeriod(authors),
      year,
      withPeriod(citation.title),
      withPeriod(join([citation.containerTitle, locator], ', ')),
      citation.doi ? `https://doi.org/${citation.doi}` : '',
    ], ' ').trim()
  }

  return join([
    withPeriod(authors),
    year,
    withPeriod(citation.title),
    withPeriod(citation.publisher || citation.containerTitle),
    citation.url,
  ], ' ').trim()
}

const harvardEntry = (citation) => {
  const authors = formatAuthors(citation.authors, 'harvard')
  const year = `(${citation.publishedYear || 'n.d.'})`

  // With no author, Harvard opens with the title instead.
  if (!authors) {
    return join([
      `${citation.title}`,
      year,
      citation.sourceType === 'journal'
        ? withPeriod(join([citation.containerTitle, citation.volume], ', '))
        : withPeriod(citation.publisher || citation.containerTitle),
      citation.sourceType === 'journal' ? '' : `Tersedia di: ${citation.url} (Diakses: ${accessedDate(citation.accessedAt, 'harvard')}).`,
    ], ' ').trim()
  }

  if (citation.sourceType === 'journal') {
    const locator = join([
      citation.volume,
      citation.issue ? `(${citation.issue})` : '',
    ], '')

    return join([
      withPeriod(authors),
      year,
      `'${citation.title}',`,
      citation.containerTitle ? `${citation.containerTitle},` : '',
      locator ? `${locator},` : '',
      pagesOf(citation) ? `pp. ${pagesOf(citation)}.` : '',
    ], ' ').trim()
  }

  return join([
    withPeriod(authors),
    year,
    `${citation.title}.`,
    citation.publisher || citation.containerTitle ? `${citation.publisher || citation.containerTitle}.` : '',
    `Tersedia di: ${citation.url}`,
    `(Diakses: ${accessedDate(citation.accessedAt, 'harvard')}).`,
  ], ' ').trim()
}

const ieeeEntry = (citation) => {
  const authors = formatAuthors(citation.authors, 'ieee')

  if (citation.sourceType === 'journal') {
    return join([
      authors ? `${authors},` : '',
      `"${citation.title},"`,
      citation.containerTitle ? `${citation.containerTitle},` : '',
      citation.volume ? `vol. ${citation.volume},` : '',
      citation.issue ? `no. ${citation.issue},` : '',
      pagesOf(citation) ? `pp. ${pagesOf(citation)},` : '',
      citation.publishedYear ? `${citation.publishedYear}.` : '',
    ], ' ').trim()
  }

  return join([
    authors ? `${authors},` : '',
    `"${citation.title}."`,
    citation.publisher || citation.containerTitle ? `${citation.publisher || citation.containerTitle}.` : '',
    `[Daring]. Tersedia di: ${citation.url}.`,
    `[Diakses: ${accessedDate(citation.accessedAt, 'ieee')}].`,
  ], ' ').trim()
}

const ENTRY_FORMATTERS = {
  vancouver: vancouverEntry,
  apa: apaEntry,
  harvard: harvardEntry,
  ieee: ieeeEntry,
}

/**
 * One bibliography entry, without its number.
 * @param {Object} citation - a serialized citation (camelCase fields)
 * @param {string} style
 */
export const formatEntry = (citation, style) => (
  (ENTRY_FORMATTERS[style] ?? vancouverEntry)(citation)
)

/**
 * The same entry as plain text: the `*…*` an APA volume carries is markup for
 * formatBibliographyHtml, and has no business in a list or on the clipboard.
 * @param {Object} citation
 * @param {string} style
 */
export const formatEntryText = (citation, style) => formatEntry(citation, style).replace(/\*/g, '')

/**
 * What the student pastes into the paragraph: "[3]" for a numbered style,
 * "(Rahman & Putri, 2015)" for an author-date one.
 * @param {Object} citation
 * @param {number} number - the entry's 1-based place in the sorted list
 * @param {string} style
 */
export const formatMarker = (citation, number, style) => {
  if (isNumericStyle(style)) return `[${number}]`

  const list = authorList(citation.authors)
  const year = citation.publishedYear || 'n.d.'

  if (list.length === 0) {
    // With no author, both styles cite by a shortened title instead.
    const short = String(citation.title ?? '').split(/\s+/).slice(0, 3).join(' ')
    return `(${short}, ${year})`
  }

  const name = (author) => author.family

  if (list.length === 1) return `(${name(list[0])}, ${year})`
  if (list.length === 2) {
    const separator = style === 'apa' ? '&' : 'and'
    return `(${name(list[0])} ${separator} ${name(list[1])}, ${year})`
  }

  return `(${name(list[0])} et al., ${year})`
}

/**
 * The order a style prints its entries in: as saved for the numbered styles,
 * alphabetically by author for the author-date ones.
 * @param {Array} citations
 * @param {string} style
 */
export const sortForStyle = (citations, style) => {
  if (isNumericStyle(style)) {
    return [...citations].sort((a, b) => a.position - b.position || a.id - b.id)
  }

  const key = (citation) => {
    const first = authorList(citation.authors)[0]
    return (first ? first.family : citation.title || '').toLowerCase()
  }

  return [...citations].sort((a, b) => key(a).localeCompare(key(b), 'id'))
}

const escapeHtml = (text) => String(text ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')

// APA marks a volume number as italic, which is the one piece of real
// formatting any of these styles asks for. It is written as *…* by the entry
// formatters and turned into markup here, after escaping.
const withItalics = (text) => escapeHtml(text).replace(/\*([^*]+)\*/g, '<em>$1</em>')

/**
 * The whole daftar pustaka as editor HTML: always a numbered list.
 *
 * The style still decides the order — saved order for Vancouver and IEEE,
 * alphabetical by author for APA and Harvard — and still decides what the
 * in-text marker looks like. It no longer decides the markup: APA and Harvard
 * used to come out as loose paragraphs, which reads as prose rather than as a
 * list and leaves the student numbering it by hand.
 * @param {Array} citations - serialized citations
 * @param {string} style
 */
export const formatBibliographyHtml = (citations, style) => {
  const sorted = sortForStyle(citations, style)
  if (sorted.length === 0) return ''

  const entries = sorted.map(citation => withItalics(formatEntry(citation, style)))

  return `<ol>${entries.map(entry => `<li>${entry}</li>`).join('')}</ol>`
}
