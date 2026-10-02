/**
 * OpenAlex Academic Search Service
 * https://api.openalex.org
 *
 * Free API key available at https://openalex.org/settings/api
 * Set OPENALEX_API_KEY in .env (preferred), or OPENALEX_EMAIL for polite pool fallback.
 *
 * Supports direct journal/source filtering — equivalent to Perplexity's
 * search_domain_filter but for academic journals (Lancet, NEJM, BMJ, etc.)
 *
 * Rate limits:
 * - Without email: 100,000 req/day, 10 req/sec
 * - With email (polite pool): same limits but prioritized queue
 */

const BASE_URL = 'https://api.openalex.org'

// Module-level cache: journal display name → resolved candidate (or null)
const sourceIdCache = new Map()

// Only these OpenAlex source types are actual peer-reviewed venues whose
// works a "trusted journal" filter should match. Other types (ebook
// platform, repository, book series, etc.) usually mean the admin typed a
// publisher name (e.g. "MDPI") rather than a specific journal title — using
// them as a filter guarantees near-zero matching works.
const FILTERABLE_SOURCE_TYPES = ['journal', 'conference']

export class OpenAlexService {
  /**
   * Resolve one journal display name to its best-matching OpenAlex source.
   * Fetches a few top candidates (not just the single top hit) and picks the
   * highest-works_count one among actual journal/conference venues, ignoring
   * non-filterable types like ebook platforms or repositories. Returns null
   * if nothing filterable matches — callers should treat that as "no filter
   * for this name" rather than forcing a filter that would zero out results.
   * Results are cached in-process to avoid repeat lookups.
   *
   * @param {string} name - e.g. "The Lancet"
   * @returns {Promise<{id: string, displayName: string, type: string, worksCount: number} | null>}
   */
  static async resolveSourceCandidate(name) {
    const key = (name || '').toLowerCase().trim()
    if (!key) return null

    if (sourceIdCache.has(key)) return sourceIdCache.get(key)

    try {
      const params = new URLSearchParams({
        filter: `display_name.search:${name.trim()}`,
        'per-page': '5',
        select: 'id,display_name,type,works_count'
      })
      if (process.env.OPENALEX_API_KEY) params.set('api_key', process.env.OPENALEX_API_KEY)
      else if (process.env.OPENALEX_EMAIL) params.set('mailto', process.env.OPENALEX_EMAIL)

      const res = await fetch(`${BASE_URL}/sources?${params}`)
      if (!res.ok) {
        console.warn(`[OpenAlex] Sources lookup failed for "${name}": ${res.status}`)
        sourceIdCache.set(key, null)
        return null
      }
      const data = await res.json()
      const results = data.results || []

      const best = results
        .filter(r => FILTERABLE_SOURCE_TYPES.includes(r.type))
        .sort((a, b) => (b.works_count || 0) - (a.works_count || 0))[0]

      if (!best) {
        const topMatch = results[0]
        console.warn(
          `[OpenAlex] No journal/conference source found for "${name}"` +
          (topMatch ? ` — closest match was "${topMatch.display_name}" (type: ${topMatch.type}), rejected` : ' — no matches at all')
        )
        sourceIdCache.set(key, null)
        return null
      }

      // Extract short ID: "https://openalex.org/S137773608" → "S137773608"
      const shortId = best.id.replace('https://openalex.org/', '')
      const resolved = { id: shortId, displayName: best.display_name, type: best.type, worksCount: best.works_count || 0 }
      sourceIdCache.set(key, resolved)
      console.log(`[OpenAlex] Resolved "${name}" → ${shortId} (${best.display_name}, ${best.type}, ${best.works_count} works)`)
      return resolved
    } catch (err) {
      console.warn(`[OpenAlex] Error resolving source for "${name}":`, err.message)
      sourceIdCache.set(key, null)
      return null
    }
  }

  /**
   * Resolve journal display names to OpenAlex source IDs via Sources API.
   * Names that don't resolve to a filterable journal/conference source are
   * silently dropped (not an error) — see resolveSourceCandidate.
   *
   * @param {string[]} journalNames - e.g. ["The Lancet", "Blood"]
   * @returns {Promise<string[]>} OpenAlex source IDs like ["S137773608", "S2764455111"]
   */
  static async resolveSourceIds(journalNames) {
    if (!journalNames || journalNames.length === 0) return []
    const candidates = await Promise.all(journalNames.map(name => this.resolveSourceCandidate(name)))
    return candidates.filter(Boolean).map(c => c.id)
  }

  /**
   * Admin-facing preview of how a journal name will resolve, so entries like
   * "MDPI" (a publisher, not a journal) are caught when the admin adds them
   * rather than silently returning zero results for a user later.
   *
   * @param {string} name
   * @returns {Promise<{resolved: boolean, matchedName?: string, sourceType?: string, worksCount?: number, warning: string | null}>}
   */
  static async previewJournalResolution(name) {
    const candidate = await this.resolveSourceCandidate(name)

    if (!candidate) {
      return {
        resolved: false,
        warning: `Nama "${name}" tidak cocok dengan jurnal/konferensi apa pun di OpenAlex. Ini mungkin nama penerbit (misalnya "MDPI" atau "Elsevier") bukan judul jurnal spesifik — filter ini tidak akan diterapkan saat pencarian, jadi tidak akan mempersempit hasil.`
      }
    }

    return {
      resolved: true,
      matchedName: candidate.displayName,
      sourceType: candidate.type,
      worksCount: candidate.worksCount,
      warning: candidate.worksCount === 0
        ? `Cocok dengan "${candidate.displayName}" tetapi jurnal ini belum memiliki artikel yang terindeks di OpenAlex.`
        : null
    }
  }

  /**
   * Browsable, paginated journal/conference listing — used by the journal
   * picker so users select a real, resolvable OpenAlex venue directly
   * (instead of typing a free-text name that may not resolve to anything
   * filterable — see resolveSourceCandidate). With no query, lists the most
   * prolific journals/conferences (sorted by works_count) so there's
   * something to browse immediately; with a query, narrows to matching
   * names (OpenAlex's own relevance ranking). Both the type restriction and
   * the name search are applied server-side in the same OpenAlex call, so
   * OpenAlex's native page/per-page pagination lines up correctly — no
   * client-side re-pagination needed.
   *
   * @param {Object} options
   * @param {string} options.query - optional; blank browses top journals
   * @param {number} options.page
   * @param {number} options.perPage
   * @returns {Promise<{data: Array<{id, name, type, worksCount, publisher}>, pagination: {page, perPage, isLastPage}}>}
   */
  static async listJournals({ query = '', page = 1, perPage = 10 } = {}) {
    const trimmed = (query || '').trim()
    const filters = [`type:${FILTERABLE_SOURCE_TYPES.join('|')}`]
    if (trimmed) filters.push(`display_name.search:${trimmed}`)

    try {
      const params = new URLSearchParams({
        filter: filters.join(','),
        page: String(page),
        'per-page': String(perPage + 1), // take perPage+1 to derive isLastPage
        select: 'id,display_name,type,works_count,host_organization_name'
      })
      if (!trimmed) params.set('sort', 'display_name') // no query → browse alphabetically
      if (process.env.OPENALEX_API_KEY) params.set('api_key', process.env.OPENALEX_API_KEY)
      else if (process.env.OPENALEX_EMAIL) params.set('mailto', process.env.OPENALEX_EMAIL)

      const res = await fetch(`${BASE_URL}/sources?${params}`)
      if (!res.ok) {
        console.warn(`[OpenAlex] Journal listing failed for "${trimmed}": ${res.status}`)
        return { data: [], pagination: { page, perPage, isLastPage: true } }
      }

      const data = await res.json()
      const results = data.results || []
      const isLastPage = results.length <= perPage

      return {
        data: results.slice(0, perPage).map(r => ({
          id: r.id.replace('https://openalex.org/', ''),
          name: r.display_name,
          type: r.type,
          worksCount: r.works_count || 0,
          publisher: r.host_organization_name || null
        })),
        pagination: { page, perPage, isLastPage }
      }
    } catch (err) {
      console.warn(`[OpenAlex] Error listing journals for "${trimmed}":`, err.message)
      return { data: [], pagination: { page, perPage, isLastPage: true } }
    }
  }

  /**
   * Reconstruct plain-text abstract from OpenAlex inverted index format.
   * OpenAlex stores abstracts as { word: [positions] } for copyright reasons.
   */
  static reconstructAbstract(invertedIndex) {
    if (!invertedIndex || typeof invertedIndex !== 'object') return ''
    const words = []
    for (const [word, positions] of Object.entries(invertedIndex)) {
      for (const pos of positions) {
        words[pos] = word
      }
    }
    return words.filter(Boolean).join(' ')
  }

  /**
   * Search OpenAlex for academic papers.
   *
   * @param {string} query - Search query (English recommended)
   * @param {Object} options
   * @param {number}   options.limit     - Max results (default 10)
   * @param {string[]} options.sourceIds - OpenAlex source IDs to filter by (e.g. ["S137773608"])
   * @returns {Promise<Array>} Raw OpenAlex work objects
   */
  static async search(query, { limit = 10, sourceIds = [], yearFrom = null, yearTo = null } = {}) {
    const params = new URLSearchParams({
      search: query.trim(),
      'per-page': String(Math.min(limit, 200)),
      select: 'id,title,abstract_inverted_index,publication_year,primary_location,doi,cited_by_count,type,best_oa_location'
    })

    // Build filter array — only use validated filter fields
    const filters = ['type:article'] // only peer-reviewed articles

    if (sourceIds.length > 0) {
      const idFilter = sourceIds.join('|')
      filters.push(`primary_location.source.id:${idFilter}`)
    }

    if (yearFrom) filters.push(`from_publication_date:${yearFrom}-01-01`)
    if (yearTo)   filters.push(`to_publication_date:${yearTo}-12-31`)

    params.set('filter', filters.join(','))

    // API key (query param) — get free key at https://openalex.org/settings/api
    if (process.env.OPENALEX_API_KEY) {
      params.set('api_key', process.env.OPENALEX_API_KEY)
    } else if (process.env.OPENALEX_EMAIL) {
      // Fallback: polite pool via email (no key)
      params.set('mailto', process.env.OPENALEX_EMAIL)
    }

    const res = await fetch(`${BASE_URL}/works?${params}`)

    if (!res.ok) {
      const text = await res.text().catch(() => res.statusText)
      throw new Error(`OpenAlex API error ${res.status}: ${text}`)
    }

    const data = await res.json()
    return data.results || []
  }

  /**
   * Run multiple queries in parallel and merge results, deduplicating by work ID.
   * Uses main_query + related_queries from the reformulation stage.
   *
   * @param {string}   mainQuery      - Primary search query
   * @param {string[]} relatedQueries - Additional queries (up to 3)
   * @param {Object}   options        - Same as search() options
   * @param {number}   maxTotal       - Max total papers after dedup (default 10)
   * @returns {Promise<Array>} Merged, deduplicated, formatted source objects
   */
  static async searchMulti(mainQuery, relatedQueries = [], options = {}, maxTotal = 10) {
    const queries = [mainQuery, ...relatedQueries.slice(0, 3)]
    const perQueryLimit = Math.ceil(maxTotal / queries.length) + 2 // slight over-fetch

    // Resolve journal names → source IDs once, share across all parallel queries
    const trustedJournals = options.trustedJournals || []
    const sourceIds = await this.resolveSourceIds(trustedJournals)
    console.log(`[OpenAlex] Resolved ${trustedJournals.length} journal names → ${sourceIds.length} source IDs`)

    const yearFrom = options.yearFrom || null
    const yearTo   = options.yearTo   || null
    if (yearFrom || yearTo) {
      console.log(`[OpenAlex] Year filter: ${yearFrom ?? 'any'} → ${yearTo ?? 'now'}`)
    }

    const results = await Promise.allSettled(
      queries.map(q => this.search(q, { limit: perQueryLimit, sourceIds, yearFrom, yearTo }))
    )

    // Merge and deduplicate by OpenAlex work ID
    const seen = new Set()
    const merged = []

    for (const result of results) {
      if (result.status !== 'fulfilled') {
        console.warn('[OpenAlex] One query failed:', result.reason?.message)
        continue
      }
      for (const work of result.value) {
        if (!work.id || seen.has(work.id)) continue
        if (!work.title) continue
        if (!work.abstract_inverted_index) continue // skip papers without abstract
        const workUrl = work.doi || work.primary_location?.landing_page_url || work.best_oa_location?.landing_page_url || ''
        if (!workUrl || workUrl.includes('openalex.org')) continue // skip openalex.org-only URLs
        seen.add(work.id)
        merged.push(work)
        if (merged.length >= maxTotal) break
      }
      if (merged.length >= maxTotal) break
    }

    console.log(`[OpenAlex] ${queries.length} queries → ${merged.length} unique papers`)

    return this.formatSources(merged)
  }

  /**
   * Format raw OpenAlex work objects into source objects compatible with
   * ResearchV2Handler (sourceType, title, content, url, score).
   */
  static formatSources(works) {
    const formatted = []
    let scoreIndex = 0

    for (const work of works) {
      const abstract = this.reconstructAbstract(work.abstract_inverted_index)

      // Prefer DOI → landing page → best OA location — never fall back to openalex.org
      const url =
        work.doi ||
        work.primary_location?.landing_page_url ||
        work.best_oa_location?.landing_page_url ||
        work.best_oa_location?.pdf_url ||
        null

      if (!url || url.includes('openalex.org')) continue // skip if no real URL

      const journal  = work.primary_location?.source?.display_name || ''
      const year     = work.publication_year || ''
      const yearStr  = year    ? ` (${year})`    : ''
      const venueStr = journal ? ` — ${journal}` : ''
      const title    = `${work.title}${yearStr}${venueStr}`

      formatted.push({
        sourceType: 'academic_paper',
        title,
        content: abstract,
        url,
        score: 1.0 - (scoreIndex * 0.05)
      })
      scoreIndex++
    }

    return formatted
  }
}
