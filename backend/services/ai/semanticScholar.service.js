/**
 * Semantic Scholar Academic Search Service
 * https://api.semanticscholar.org/graph/v1
 *
 * Free, no API key required (optional key for higher rate limits).
 * Set SEMANTIC_SCHOLAR_API_KEY in .env for 100req/s instead of 100req/5min.
 *
 * Returns peer-reviewed academic papers with full abstracts — ideal for
 * RAG pipelines where Gemini generates the final answer from paper abstracts.
 */

const BASE_URL = 'https://api.semanticscholar.org/graph/v1'

// Fields to request from Semantic Scholar
const PAPER_FIELDS = 'title,abstract,year,venue,externalIds,tldr,openAccessPdf,citationCount'

export class SemanticScholarService {
  /**
   * Search for academic papers matching a query.
   * @param {string} query - Search query (English recommended)
   * @param {Object} options
   * @param {number} options.limit - Max results (default 10, max 100)
   * @param {string} options.fieldsOfStudy - Comma-separated fields e.g. "Medicine,Pharmacology"
   * @returns {Promise<Array>} Raw paper objects from Semantic Scholar
   */
  static async search(query, { limit = 10, fieldsOfStudy = null } = {}) {
    const params = new URLSearchParams({
      query: query.trim(),
      fields: PAPER_FIELDS,
      limit: String(Math.min(limit, 100))
    })

    if (fieldsOfStudy && fieldsOfStudy.trim()) {
      params.set('fieldsOfStudy', fieldsOfStudy.trim())
    }

    const headers = {}
    if (process.env.SEMANTIC_SCHOLAR_API_KEY) {
      headers['x-api-key'] = process.env.SEMANTIC_SCHOLAR_API_KEY
    }

    const res = await fetch(`${BASE_URL}/paper/search?${params}`, { headers })

    if (!res.ok) {
      const text = await res.text().catch(() => res.statusText)
      throw new Error(`Semantic Scholar API error ${res.status}: ${text}`)
    }

    const data = await res.json()
    return data.data || []
  }

  /**
   * Run multiple queries in parallel and merge results, deduplicating by paperId.
   * Uses main_query + related_queries from the reformulation stage.
   *
   * @param {string} mainQuery - Primary search query
   * @param {string[]} relatedQueries - Additional queries (up to 3)
   * @param {Object} options - Same as search() options
   * @param {number} maxTotal - Max total papers after dedup (default 10)
   * @returns {Promise<Array>} Merged, deduplicated, formatted source objects
   */
  static async searchMulti(mainQuery, relatedQueries = [], options = {}, maxTotal = 10) {
    const perQueryLimit = Math.ceil(maxTotal / Math.max(relatedQueries.length + 1, 1))
    const queries = [mainQuery, ...relatedQueries.slice(0, 3)]

    // Run all queries in parallel
    const results = await Promise.allSettled(
      queries.map(q => this.search(q, { ...options, limit: perQueryLimit }))
    )

    // Merge and deduplicate by paperId
    const seen = new Set()
    const merged = []

    for (const result of results) {
      if (result.status !== 'fulfilled') continue
      for (const paper of result.value) {
        if (!paper.paperId || seen.has(paper.paperId)) continue
        // Skip papers without title or any text content
        if (!paper.title) continue
        if (!paper.abstract && !paper.tldr?.text) continue
        seen.add(paper.paperId)
        merged.push(paper)
        if (merged.length >= maxTotal) break
      }
      if (merged.length >= maxTotal) break
    }

    console.log(`[SemanticScholar] ${queries.length} queries → ${merged.length} unique papers`)

    return this.formatSources(merged)
  }

  /**
   * Format raw Semantic Scholar paper objects into source objects
   * compatible with ResearchV2Handler (sourceType, title, content, url, score).
   */
  static formatSources(papers) {
    return papers.map((paper, i) => {
      // Build URL: prefer DOI → PubMed → Semantic Scholar page
      const doi      = paper.externalIds?.DOI
      const pubmedId = paper.externalIds?.PubMed
      const url = doi
        ? `https://doi.org/${doi}`
        : pubmedId
          ? `https://pubmed.ncbi.nlm.nih.gov/${pubmedId}/`
          : `https://www.semanticscholar.org/paper/${paper.paperId}`

      // Title with year and journal
      const yearStr  = paper.year  ? ` (${paper.year})`  : ''
      const venueStr = paper.venue ? ` — ${paper.venue}` : ''
      const title    = `${paper.title}${yearStr}${venueStr}`

      // Content: full abstract preferred, fall back to tldr
      const content = paper.abstract || paper.tldr?.text || ''

      return {
        sourceType: 'academic_paper',
        title,
        content,
        url,
        score: 1.0 - (i * 0.05)
      }
    })
  }
}
