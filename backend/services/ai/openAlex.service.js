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

// Module-level cache: journal display name → OpenAlex source ID (e.g. "The Lancet" → "S137773608")
const sourceIdCache = new Map()

export class OpenAlexService {
  /**
   * Resolve journal display names to OpenAlex source IDs via Sources API.
   * Results are cached in-process to avoid repeat lookups.
   *
   * @param {string[]} journalNames - e.g. ["The Lancet", "Blood"]
   * @returns {Promise<string[]>} OpenAlex source IDs like ["S137773608", "S2764455111"]
   */
  static async resolveSourceIds(journalNames) {
    if (!journalNames || journalNames.length === 0) return []

    const ids = []

    for (const name of journalNames) {
      const key = name.toLowerCase().trim()
      if (!key) continue

      if (sourceIdCache.has(key)) {
        const cached = sourceIdCache.get(key)
        if (cached) ids.push(cached)
        continue
      }

      try {
        const params = new URLSearchParams({
          filter: `display_name.search:${name.trim()}`,
          'per-page': '1',
          select: 'id,display_name'
        })
        if (process.env.OPENALEX_API_KEY) params.set('api_key', process.env.OPENALEX_API_KEY)
        else if (process.env.OPENALEX_EMAIL) params.set('mailto', process.env.OPENALEX_EMAIL)

        const res = await fetch(`${BASE_URL}/sources?${params}`)
        if (!res.ok) {
          console.warn(`[OpenAlex] Sources lookup failed for "${name}": ${res.status}`)
          sourceIdCache.set(key, null)
          continue
        }

        const data = await res.json()
        const source = data.results?.[0]
        if (source?.id) {
          // Extract short ID: "https://openalex.org/S137773608" → "S137773608"
          const shortId = source.id.replace('https://openalex.org/', '')
          sourceIdCache.set(key, shortId)
          ids.push(shortId)
          console.log(`[OpenAlex] Resolved "${name}" → ${shortId} (${source.display_name})`)
        } else {
          console.warn(`[OpenAlex] No source found for journal: "${name}"`)
          sourceIdCache.set(key, null)
        }
      } catch (err) {
        console.warn(`[OpenAlex] Error resolving source ID for "${name}":`, err.message)
        sourceIdCache.set(key, null)
      }
    }

    return ids
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
  static async search(query, { limit = 10, sourceIds = [] } = {}) {
    const params = new URLSearchParams({
      search: query.trim(),
      'per-page': String(Math.min(limit, 200)),
      select: 'id,title,abstract_inverted_index,publication_year,primary_location,doi,cited_by_count,type,best_oa_location'
    })

    // Build filter array — only use validated filter fields
    const filters = ['type:article'] // only peer-reviewed articles

    if (sourceIds.length > 0) {
      // Pipe-separated source IDs → OR within the same filter (valid field)
      const idFilter = sourceIds.join('|')
      filters.push(`primary_location.source.id:${idFilter}`)
    }

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

    const results = await Promise.allSettled(
      queries.map(q => this.search(q, { limit: perQueryLimit, sourceIds }))
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
