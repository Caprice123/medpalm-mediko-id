import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import { PerplexityService } from '#services/ai/perplexity.service'
import { GetConstantsService } from '#services/constant/getConstantsService'
import { checkAccessAndDeductCredit } from '#services/shared/checkAccessAndDeductCreditService'

const MAX_QUERIES = 5
const MAX_RESULTS_LIMIT = 20
const DEFAULT_MAX_RESULTS = 10
const RECENCY_VALUES = ['hour', 'day', 'week', 'month', 'year']
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

// Perplexity wants MM/DD/YYYY on its date filters while the form sends what an
// <input type="date"> produces.
const toPerplexityDate = (value, label) => {
  if (!value) return null

  if (!ISO_DATE.test(value)) {
    throw new ValidationError(`${label} tidak valid`)
  }

  const [year, month, day] = value.split('-')
  return `${month}/${day}/${year}`
}

const cleanList = (value) => (Array.isArray(value) ? value : [])
  .map(item => (typeof item === 'string' ? item.trim() : ''))
  .filter(Boolean)

// The Searcher panel: journal and web lookups with explicit filters, answered
// by Perplexity's Search API rather than by a model. Nothing is written to the
// database — a search is a lookup, and what the student keeps they paste into
// their report.
export class RunSkripsiSearcherV2Service extends BaseService {
  static async call({
    userId,
    queries,
    searchType = null,
    maxResults = null,
    dateFrom = null,
    dateTo = null,
    recency = null,
    domains = [],
    languages = [],
  }) {
    const cleanQueries = cleanList(queries)

    if (cleanQueries.length === 0) {
      throw new ValidationError('Kata kunci pencarian wajib diisi')
    }

    if (cleanQueries.length > MAX_QUERIES) {
      throw new ValidationError(`Maksimal ${MAX_QUERIES} kata kunci sekaligus`)
    }

    if (searchType && !['web', 'academic'].includes(searchType)) {
      throw new ValidationError('Tipe pencarian tidak valid')
    }

    if (recency && !RECENCY_VALUES.includes(recency)) {
      throw new ValidationError('Rentang waktu tidak valid')
    }

    let limit = null
    if (maxResults !== null && maxResults !== undefined && maxResults !== '') {
      limit = parseInt(maxResults)
      if (isNaN(limit) || limit < 1 || limit > MAX_RESULTS_LIMIT) {
        throw new ValidationError(`Batas hasil harus antara 1 dan ${MAX_RESULTS_LIMIT}`)
      }
    }

    // V2 has its own switch and its own price for the Searcher; only the
    // feature-wide access type is still read from the key both versions share.
    const constants = await GetConstantsService.call([
      'skripsi_access_type',
      'pbl_searcher_enabled',
      'pbl_searcher_cost',
      'pbl_searcher_max_results',
    ])

    if (constants.pbl_searcher_enabled !== 'true') {
      throw new ValidationError('Fitur pencarian sedang tidak aktif')
    }

    await checkAccessAndDeductCredit(prisma, {
      userId,
      userRole: 'user',
      accessTypeKey: 'skripsi_access_type',
      creditCostKey: 'pbl_searcher_cost',
      // Matching the chat path, which checks access but has never actually
      // charged for a message. Turning billing on is a product decision.
      deductCredit: false,
      description: '',
      featureKey: 'skripsi_builder',
    })

    const params = {
      // One string searches once; an array runs every query in one request,
      // which is what the Multiple mode sends.
      query: cleanQueries.length === 1 ? cleanQueries[0] : cleanQueries,
      // The admin sets how many results a search returns when the student
      // leaves the limit filter off.
      max_results: limit ?? (parseInt(constants.pbl_searcher_max_results) || DEFAULT_MAX_RESULTS),
    }

    // Sent only when the student actually turned the filter on: `search_mode`
    // is not accepted on every Perplexity key, so defaulting it would fail a
    // search that never asked for the web/academic split in the first place.
    if (searchType) params.search_mode = searchType

    const after = toPerplexityDate(dateFrom, 'Tanggal mulai')
    const before = toPerplexityDate(dateTo, 'Tanggal akhir')

    if (after) params.search_after_date_filter = after
    if (before) params.search_before_date_filter = before
    if (recency) params.search_recency_filter = recency

    const domainList = cleanList(domains)
    if (domainList.length > 0) params.search_domain_filter = domainList

    const languageList = cleanList(languages)
    if (languageList.length > 0) params.search_language_filter = languageList

    const { id, results, raw } = await PerplexityService.search(params)

    return {
      id,
      queries: cleanQueries,
      results: results.map(result => ({
        title: result.title,
        url: result.url,
        snippet: result.snippet,
        date: result.date ?? null,
        lastUpdated: result.last_updated ?? null,
      })),
      raw,
    }
  }
}
