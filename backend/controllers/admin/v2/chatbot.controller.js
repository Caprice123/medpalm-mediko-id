import { GetAdminConversationsV2Service } from '#services/chatbot/v2/admin/getAdminConversationsV2Service'
import { GetAdminConversationMessagesService } from '#services/chatbot/admin/getAdminConversationMessagesService'
import { DeleteAdminConversationService } from '#services/chatbot/admin/deleteAdminConversationService'
import { GetResearchDomainsService } from '#services/chatbot/admin/getResearchDomainsService'
import { CreateResearchDomainService } from '#services/chatbot/admin/createResearchDomainService'
import { UpdateResearchDomainService } from '#services/chatbot/admin/updateResearchDomainService'
import { DeleteResearchDomainService } from '#services/chatbot/admin/deleteResearchDomainService'
import { GetJournalNamesService } from '#services/chatbot/admin/getJournalNamesService'
import { CreateJournalNameService } from '#services/chatbot/admin/createJournalNameService'
import { UpdateJournalNameService } from '#services/chatbot/admin/updateJournalNameService'
import { DeleteJournalNameService } from '#services/chatbot/admin/deleteJournalNameService'
import { ChatbotConversationListV2Serializer } from '#serializers/admin/v2/chatbotConversationListSerializer'
import { ChatbotMessageAdminV2Serializer } from '#serializers/admin/v2/chatbotMessageSerializer'
import {
  ChatbotResearchRegistryV2,
  RESEARCH_IMPLEMENTATIONS,
  RESEARCH_IMPLEMENTATION_KEY,
} from '#services/chatbot/v2/chatbotResearchRegistryV2'

class ChatbotAdminV2Controller {
  async getConversations(req, res) {
    const { page, perPage, userId, search } = req.query

    const result = await GetAdminConversationsV2Service.call({
      page: parseInt(page) || 1,
      perPage: parseInt(perPage) || 20,
      userId: userId || undefined,
      search,
    })

    return res.status(200).json({
      data: ChatbotConversationListV2Serializer.serialize(result.data),
      pagination: result.pagination,
    })
  }

  async getConversationMessages(req, res) {
    const { page, perPage } = req.query

    const result = await GetAdminConversationMessagesService.call({
      conversationId: req.params.uniqueId,
      page: parseInt(page) || 1,
      perPage: parseInt(perPage) || 50,
    })

    return res.status(200).json({
      data: ChatbotMessageAdminV2Serializer.serialize(result.messages),
      pagination: result.pagination,
    })
  }

  async deleteConversation(req, res) {
    await DeleteAdminConversationService.call({ conversationId: req.params.uniqueId })

    return res.status(200).json({ data: { success: true } })
  }

  // Which research implementation answers a research message. The options come
  // from the registry so the panel cannot offer a key the backend won't accept;
  // the value itself is stored as an ordinary constant and saved through the
  // existing constants endpoint, like every other chatbot setting.
  async getResearchImplementations(req, res) {
    const current = await ChatbotResearchRegistryV2.resolve()

    return res.status(200).json({
      data: {
        constantKey: RESEARCH_IMPLEMENTATION_KEY,
        current: current.key,
        options: Object.entries(RESEARCH_IMPLEMENTATIONS).map(([key, def]) => ({
          key,
          label: def.label,
          retriever: def.retriever,
        })),
      },
    })
  }

  async getResearchDomains(req, res) {
    const { page = 1, perPage = 12, search = '' } = req.query
    const result = await GetResearchDomainsService.call({
      page: parseInt(page),
      perPage: parseInt(perPage),
      search,
    })

    return res.status(200).json({ data: result })
  }

  async createResearchDomain(req, res) {
    const { domain, journal_name } = req.body
    const created = await CreateResearchDomainService.call({ domain, journal_name })

    return res.status(201).json({ data: created })
  }

  async updateResearchDomain(req, res) {
    const { is_active, journal_name } = req.body
    const updated = await UpdateResearchDomainService.call({ id: req.params.id, is_active, journal_name })

    return res.status(200).json({ data: updated })
  }

  async deleteResearchDomain(req, res) {
    await DeleteResearchDomainService.call({ id: req.params.id })

    return res.status(200).json({ data: { success: true } })
  }

  async getJournals(req, res) {
    const { page = 1, perPage = 20, search = '' } = req.query
    const result = await GetJournalNamesService.call({
      page: parseInt(page),
      perPage: parseInt(perPage),
      search,
    })

    return res.status(200).json({ data: result })
  }

  async createJournal(req, res) {
    const journal = await CreateJournalNameService.call({ name: req.body.name })

    return res.status(201).json({ data: journal })
  }

  async updateJournal(req, res) {
    const { name, is_active } = req.body
    const journal = await UpdateJournalNameService.call({ id: req.params.id, name, is_active })

    return res.status(200).json({ data: journal })
  }

  async deleteJournal(req, res) {
    await DeleteJournalNameService.call({ id: req.params.id })

    return res.status(200).json({ data: { success: true } })
  }
}

export default new ChatbotAdminV2Controller()
