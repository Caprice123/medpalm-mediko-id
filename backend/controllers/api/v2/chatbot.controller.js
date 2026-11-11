import prisma from '#prisma/client'
import { GetChatbotBootstrapV2Service } from '#services/chatbot/v2/getChatbotBootstrapV2Service'
import { UpdateUserChatbotSettingsService } from '#services/chatbot/user/updateUserChatbotSettingsService'
import { GetChatbotDomainsService } from '#services/chatbot/user/getChatbotDomainsService'
import { GetChatbotJournalsService } from '#services/chatbot/user/getChatbotJournalsService'
import { SearchChatbotJournalsService } from '#services/chatbot/user/searchChatbotJournalsService'

class ChatbotV2Controller {
  // One read for everything the chat shell needs on mount: feature config
  // (modes, costs, per-mode notice) plus this user's own chat settings.
  async bootstrap(req, res) {
    const result = await GetChatbotBootstrapV2Service.call({ userId: req.user.id })

    return res.status(200).json({ data: result })
  }

  async updateSettings(req, res) {
    const { selectedDomains, customDomains, domainFilterEnabled, selectedJournals, customJournals, latestYears, yearFrom, yearTo } = req.body

    const settings = await UpdateUserChatbotSettingsService.call(req.user.id, {
      selectedDomains,
      customDomains,
      domainFilterEnabled,
      selectedJournals,
      customJournals,
      latestYears,
      yearFrom,
      yearTo,
    })

    return res.status(200).json({ data: settings })
  }

  async domains(req, res) {
    const { page = 1, perPage = 12, search = '' } = req.query

    // Tutors pick a journal alongside a domain, so they only see domains that
    // actually carry one.
    const userRecord = await prisma.users.findUnique({ where: { id: req.user.id }, select: { role: true } })

    const result = await GetChatbotDomainsService.call({
      page: parseInt(page),
      perPage: parseInt(perPage),
      search,
      onlyWithJournal: userRecord?.role === 'tutor',
    })

    return res.status(200).json({ data: result })
  }

  async journals(req, res) {
    const { page = 1, perPage = 20, search = '' } = req.query

    const result = await GetChatbotJournalsService.call({
      page: parseInt(page),
      perPage: parseInt(perPage),
      search,
    })

    return res.status(200).json({ data: result })
  }

  // Live lookup against the journal index itself, not the admin-curated list,
  // so a user only picks journals that actually resolve.
  async searchJournals(req, res) {
    const { q = '', page = 1, perPage = 10 } = req.query

    const result = await SearchChatbotJournalsService.call({
      query: q,
      page: parseInt(page),
      perPage: parseInt(perPage),
    })

    return res.status(200).json({ data: result.data, pagination: result.pagination })
  }
}

export default new ChatbotV2Controller()
