import prisma from '#prisma/client'
import { GetUserChatbotSettingsService } from '#services/chatbot/user/getUserChatbotSettingsService'
import { UpdateUserChatbotSettingsService } from '#services/chatbot/user/updateUserChatbotSettingsService'
import { GetChatbotDomainsService } from '#services/chatbot/user/getChatbotDomainsService'
import { GetChatbotJournalsService } from '#services/chatbot/user/getChatbotJournalsService'

class ChatbotSettingsController {
  async getSettings(req, res) {
    const userId = req.user.id
    const settings = await GetUserChatbotSettingsService.call(userId)
    return res.status(200).json({ data: settings })
  }

  async updateSettings(req, res) {
    const userId = req.user.id
    const { selectedDomains, customDomains, domainFilterEnabled, selectedJournals, customJournals } = req.body
    const settings = await UpdateUserChatbotSettingsService.call(userId, {
      selectedDomains,
      customDomains,
      domainFilterEnabled,
      selectedJournals,
      customJournals
    })
    return res.status(200).json({ data: settings })
  }

  async getDomains(req, res) {
    const userId = req.user.id
    const { page = 1, perPage = 12, search = '' } = req.query
    const userRecord = await prisma.users.findUnique({ where: { id: userId }, select: { role: true } })
    const onlyWithJournal = userRecord?.role === 'tutor'
    const result = await GetChatbotDomainsService.call({
      page: parseInt(page),
      perPage: parseInt(perPage),
      search,
      onlyWithJournal
    })
    return res.status(200).json({ data: result })
  }

  async getJournals(req, res) {
    const { page = 1, perPage = 20, search = '' } = req.query
    const result = await GetChatbotJournalsService.call({
      page: parseInt(page),
      perPage: parseInt(perPage),
      search
    })
    return res.status(200).json({ data: result })
  }
}

export default new ChatbotSettingsController()
