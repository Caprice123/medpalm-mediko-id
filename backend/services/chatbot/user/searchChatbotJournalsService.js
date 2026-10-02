import { BaseService } from '#services/baseService'
import { OpenAlexService } from '#services/ai/openAlex.service'

export class SearchChatbotJournalsService extends BaseService {
  static async call({ query = '', page = 1, perPage = 10 }) {
    return OpenAlexService.listJournals({ query, page, perPage })
  }
}
