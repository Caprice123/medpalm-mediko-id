// A Searcher result carries a title, a URL and maybe a date. An APA or
// Vancouver entry needs the authors, the journal, the volume, the issue and the
// pages, none of which Perplexity returns — so the URL is resolved against
// whatever answers for free and without a key, in order of how much it can be
// trusted:
//
//   1. PubMed, by the PMID in the URL (a PMC id is converted to one first)
//   2. Crossref, by the DOI in the URL
//   3. Crossref, by title — only when the titles match exactly
//   4. The page's own citation meta tags (Highwire/Dublin Core/OpenGraph)
//   5. A web entry, which is the correct citation shape for a guideline anyway
//
// No model is involved at any step: every source either states the metadata
// itself or is not used, so an author can never be invented.

const LOOKUP_TIMEOUT_MS = 6000
const MAX_PAGE_BYTES = 200000

// Crossref asks callers to identify themselves and gives the polite pool in
// return; NCBI asks for the same by convention.
const USER_AGENT = 'MedIko/1.0 (https://mediko.id; mailto:support@mediko.id)'

const DOI_PATTERN = /\b(10\.\d{4,9}\/[-._;()/:a-z0-9]+)\b/i
const PUBMED_PATTERN = /pubmed\.ncbi\.nlm\.nih\.gov\/(\d+)/i
// Both shapes NCBI has used: the old ncbi.nlm.nih.gov/pmc/articles/PMC123 and
// the current pmc.ncbi.nlm.nih.gov/articles/PMC123. PMC links are most of what
// a medical search returns, so missing one of the two costs real coverage.
const PMC_PATTERN = /(?:pmc\/articles|pmc\.ncbi\.nlm\.nih\.gov\/articles)\/PMC(\d+)/i

// A DOI picked out of a URL often keeps the query string or a trailing bracket
// that was never part of it.
const cleanDoi = (doi) => doi
  .replace(/[?#].*$/, '')
  .replace(/[).,;]+$/, '')

export const doiFromUrl = (url) => {
  const match = DOI_PATTERN.exec(decodeURIComponent(url || ''))
  return match ? cleanDoi(match[1]) : null
}

export const pmidFromUrl = (url) => {
  const match = PUBMED_PATTERN.exec(url || '')
  return match ? match[1] : null
}

export const pmcidFromUrl = (url) => {
  const match = PMC_PATTERN.exec(url || '')
  return match ? match[1] : null
}

// A search engine's title is the page's <title>, which usually carries the site
// on the end — "Dengue — The Lancet | ScienceDirect". Crossref is asked for an
// exact title match, so that tail has to go or the paper is never found.
export const stripTitleSuffix = (title) => String(title ?? '')
  .split(/\s+[|·]\s+/)[0]
  .replace(/\s+[-–—]\s+[^-–—]{1,40}$/, '')
  .trim()

const fetchWithTimeout = async (url, options = {}) => {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), LOOKUP_TIMEOUT_MS)

  try {
    const response = await fetch(url, {
      ...options,
      headers: { 'User-Agent': USER_AGENT, ...options.headers },
      signal: controller.signal,
    })

    return response.ok ? response : null
  } catch {
    // A registry being slow, down or rate-limiting is not a reason to fail the
    // save — the caller falls through to the next source.
    return null
  } finally {
    clearTimeout(timer)
  }
}

const fetchJson = async (url) => {
  const response = await fetchWithTimeout(url, { headers: { Accept: 'application/json' } })
  if (!response) return null

  try {
    return await response.json()
  } catch {
    return null
  }
}

// "Rahman AB" is how PubMed gives a name; the family name is everything before
// the trailing initials.
const splitPubmedAuthor = (name) => {
  const match = /^(.*?)\s+([A-Z]{1,3})$/.exec((name || '').trim())
  return match
    ? { family: match[1], given: match[2].split('').join(' ') }
    : { family: (name || '').trim(), given: '' }
}

const yearOf = (value) => {
  const match = /(\d{4})/.exec(String(value ?? ''))
  return match ? match[1] : null
}

// PubMed's pubdate is "2010 Jan 15", "2010 Jan" or "2010"; only a full one can
// become a yyyy-mm-dd.
const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']

const pubmedDate = (pubdate) => {
  const parts = String(pubdate ?? '').trim().split(/\s+/)
  const year = yearOf(parts[0])
  if (!year) return null

  const month = MONTHS.indexOf(String(parts[1] ?? '').toLowerCase().slice(0, 3))
  if (month === -1) return null

  const day = /^\d{1,2}$/.test(parts[2] ?? '') ? parts[2] : null
  if (!day) return null

  return `${year}-${String(month + 1).padStart(2, '0')}-${day.padStart(2, '0')}`
}

// NCBI's own id converter, same free endpoint the PMC site uses. A PMC article
// almost always has a PMID; this is the only way to get from one to the other.
const pmidFromPmcid = async (pmcid) => {
  const payload = await fetchJson(`https://www.ncbi.nlm.nih.gov/pmc/utils/idconv/v1.0/?ids=PMC${pmcid}&format=json`)
  return payload?.records?.[0]?.pmid ?? null
}

const fromPubmed = async (pmid) => {
  const payload = await fetchJson(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${pmid}&retmode=json`)
  const record = payload?.result?.[pmid]

  if (!record || record.error) return null

  const doi = (record.articleids || []).find(id => id.idtype === 'doi')?.value

  return {
    sourceType: 'journal',
    title: record.title?.replace(/\.$/, '') || null,
    authors: (record.authors || [])
      .filter(author => author.authtype === 'Author' && author.name)
      .map(author => splitPubmedAuthor(author.name)),
    containerTitle: record.fulljournalname || record.source || null,
    publisher: null,
    volume: record.volume || null,
    issue: record.issue || null,
    pages: record.pages || null,
    doi: doi ? cleanDoi(doi) : null,
    pmid,
    publishedYear: yearOf(record.pubdate),
    publishedDate: pubmedDate(record.pubdate),
  }
}

const fromCrossrefWork = (work, doi) => ({
  sourceType: 'journal',
  title: Array.isArray(work.title) ? work.title[0] : work.title || null,
  authors: (work.author || [])
    .filter(author => author.family || author.name)
    .map(author => ({ family: author.family || author.name, given: author.given || '' })),
  containerTitle: Array.isArray(work['container-title']) ? work['container-title'][0] : null,
  publisher: work.publisher || null,
  volume: work.volume || null,
  issue: work.issue || null,
  pages: work.page || null,
  doi: cleanDoi(doi || work.DOI || ''),
  pmid: null,
  publishedYear: String(work.issued?.['date-parts']?.[0]?.[0] ?? '') || null,
  publishedDate: null,
})

const fromCrossrefDoi = async (doi) => {
  const payload = await fetchJson(`https://api.crossref.org/works/${encodeURIComponent(doi)}`)
  return payload?.message ? fromCrossrefWork(payload.message, doi) : null
}

const normalizeTitle = (value) => String(value ?? '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, ' ')
  .trim()

// Only used when there is neither a DOI nor a PMID: Crossref always returns its
// closest match, so anything but an exact title match is rejected rather than
// attached to the wrong paper.
const fromCrossrefTitle = async (title) => {
  const wanted = normalizeTitle(stripTitleSuffix(title))
  if (wanted.length < 25) return null

  const payload = await fetchJson(`https://api.crossref.org/works?rows=1&select=DOI,title,author,container-title,publisher,volume,issue,page,issued&query.bibliographic=${encodeURIComponent(stripTitleSuffix(title))}`)
  const work = payload?.message?.items?.[0]
  if (!work) return null

  const found = normalizeTitle(Array.isArray(work.title) ? work.title[0] : work.title)
  if (found !== wanted) return null

  return fromCrossrefWork(work, work.DOI)
}

const META_PATTERN = /<meta\s+[^>]*>/gi

// The page's own declaration of what it is: Highwire (`citation_*`, which is
// what Google Scholar reads), Dublin Core, then OpenGraph. Read, never inferred
// — a page that declares nothing stays a web entry.
const metaTags = (html) => {
  const tags = {}

  for (const tag of html.match(META_PATTERN) || []) {
    const name = /(?:name|property)\s*=\s*["']([^"']+)["']/i.exec(tag)?.[1]?.toLowerCase()
    const content = /content\s*=\s*["']([^"']*)["']/i.exec(tag)?.[1]

    if (!name || !content) continue

    // Repeated keys are the author list, in order.
    if (tags[name]) tags[name] = `${tags[name]}|${content}`
    else tags[name] = content
  }

  return tags
}

// "Rahman, Ahmad" or "Ahmad Rahman" — the comma form is unambiguous, the other
// is read as given-name-first, which is how these tags are written.
const splitMetaAuthor = (name) => {
  const trimmed = (name || '').trim()
  if (!trimmed) return null

  if (trimmed.includes(',')) {
    const [family, given] = trimmed.split(',')
    return { family: family.trim(), given: (given || '').trim() }
  }

  const parts = trimmed.split(/\s+/)
  return parts.length === 1
    ? { family: parts[0], given: '' }
    : { family: parts[parts.length - 1], given: parts.slice(0, -1).join(' ') }
}

const fromPageMeta = async (url) => {
  const response = await fetchWithTimeout(url, { headers: { Accept: 'text/html' } })
  if (!response) return null

  const type = response.headers.get('content-type') || ''
  if (!type.includes('html')) return null

  let html = ''
  try {
    html = (await response.text()).slice(0, MAX_PAGE_BYTES)
  } catch {
    return null
  }

  const tags = metaTags(html)

  const authorField = tags.citation_author || tags['dc.creator'] || tags.author || ''
  const authors = authorField
    .split('|')
    .map(splitMetaAuthor)
    .filter(Boolean)

  const journal = tags.citation_journal_title || tags['citation_inbook_title'] || null
  const date = tags.citation_publication_date || tags.citation_date || tags['dc.date'] || tags['article:published_time'] || null
  const doi = tags.citation_doi ? cleanDoi(tags.citation_doi) : null

  // Nothing worth having beyond what the search result already said.
  if (authors.length === 0 && !journal && !doi) return null

  return {
    sourceType: journal || doi ? 'journal' : 'web',
    title: tags.citation_title || null,
    authors,
    containerTitle: journal || tags['og:site_name'] || null,
    publisher: tags.citation_publisher || tags['dc.publisher'] || null,
    volume: tags.citation_volume || null,
    issue: tags.citation_issue || null,
    pages: tags.citation_firstpage
      ? [tags.citation_firstpage, tags.citation_lastpage].filter(Boolean).join('-')
      : null,
    doi,
    pmid: tags.citation_pmid || null,
    publishedYear: yearOf(date),
    publishedDate: /^\d{4}-\d{2}-\d{2}/.test(String(date ?? '')) ? String(date).slice(0, 10) : null,
  }
}

const hostnameOf = (url) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return null
  }
}

/**
 * Everything known about one source, ready to be stored.
 * @param {Object} result - { title, url, date } as the Searcher returned it
 * @returns {Promise<Object>} the citation fields, 'journal' or 'web'
 */
export const resolveCitationMetadata = async ({ title, url, date = null }) => {
  const pmcid = pmcidFromUrl(url)
  const pmid = pmidFromUrl(url) || (pmcid ? await pmidFromPmcid(pmcid) : null)
  const doi = doiFromUrl(url)

  const resolved = (pmid && await fromPubmed(pmid))
    || (doi && await fromCrossrefDoi(doi))
    || await fromCrossrefTitle(title)
    || await fromPageMeta(url)

  if (resolved) {
    return {
      ...resolved,
      // The registry's own title is the canonical one, but a lookup that found
      // the record and no title must not blank out what the student saw.
      title: resolved.title || stripTitleSuffix(title) || title,
      doi: resolved.doi || doi,
      pmid: resolved.pmid || pmid || (pmcid ? `PMC${pmcid}` : null),
      publishedYear: resolved.publishedYear || yearOf(date),
      publishedDate: resolved.publishedDate || date || null,
    }
  }

  return {
    sourceType: 'web',
    title: stripTitleSuffix(title) || title,
    authors: [],
    containerTitle: hostnameOf(url),
    publisher: null,
    volume: null,
    issue: null,
    pages: null,
    doi,
    pmid: pmid ?? (pmcid ? `PMC${pmcid}` : null),
    publishedYear: yearOf(date),
    publishedDate: date || null,
  }
}
