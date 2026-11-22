import { GetSkripsiDomainsService } from '#services/skripsi/getSkripsiDomainsService'
import { GetSkripsiJournalsService } from '#services/skripsi/user/getSkripsiJournalsService'
import { SearchSkripsiJournalsService } from '#services/skripsi/user/searchSkripsiJournalsService'
import { RunSkripsiSearcherV2Service } from '#services/skripsi/v2/runSkripsiSearcherV2Service'

// The pickers behind a set's research settings: the admin-curated domain and
// journal lists, plus a live lookup so a user can only choose journals that
// actually resolve at search time.
class SkripsiResearchV2Controller {
  // The Searcher panel. Perplexity answers with web pages rather than prose,
  // so there is no stream and no message row — just results.
  async search(req, res) {
    const {
      queries, searchType, maxResults, dateFrom, dateTo, recency, domains, languages,
    } = req.body

    const result = await RunSkripsiSearcherV2Service.call({
      userId: req.user.id,
      queries,
      searchType,
      maxResults,
      dateFrom,
      dateTo,
      recency,
      domains,
      languages,
    })

    return res.status(200).json({ data: result })
  }

  async domains(req, res) {
    const { page = 1, perPage = 12, search = '' } = req.query

    const result = await GetSkripsiDomainsService.call({
      page: parseInt(page),
      perPage: parseInt(perPage),
      search,
    })

    return res.status(200).json({ data: result })
  }

  async journals(req, res) {
    const { page = 1, perPage = 20, search = '' } = req.query

    const result = await GetSkripsiJournalsService.call({
      page: parseInt(page),
      perPage: parseInt(perPage),
      search,
    })

    return res.status(200).json({ data: result })
  }

  async searchJournals(req, res) {
    const { q = '', page = 1, perPage = 10 } = req.query

    const result = await SearchSkripsiJournalsService.call({
      query: q,
      page: parseInt(page),
      perPage: parseInt(perPage),
    })

    return res.status(200).json({ data: result.data, pagination: result.pagination })
  }
}

export default new SkripsiResearchV2Controller()
