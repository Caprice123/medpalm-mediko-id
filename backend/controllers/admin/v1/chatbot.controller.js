import { GetAdminConversationsService } from '#services/chatbot/admin/getAdminConversationsService'
import { GetAdminConversationService } from '#services/chatbot/admin/getAdminConversationService'
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
import { ChatbotConversationSerializer } from '#serializers/admin/v1/chatbotConversationSerializer'
import { ChatbotConversationListSerializer } from '#serializers/admin/v1/chatbotConversationListSerializer'
import { ChatbotMessageSerializer } from '#serializers/admin/v1/chatbotMessageSerializer'

class ChatbotAdminController {
  // Get all conversations with filters
  async getConversations(req, res) {
    const { page, perPage, userId, search } = req.query

    const result = await GetAdminConversationsService.call({
      page: parseInt(page) || 1,
      perPage: parseInt(perPage) || 20,
      userId: userId ? parseInt(userId) : undefined,
      search
    })

    return res.status(200).json({
      data: ChatbotConversationListSerializer.serialize(result.data),
      pagination: result.pagination
    })
  }

  // Get conversation details
  async getConversation(req, res) {
    const { uniqueId } = req.params

    const conversation = await GetAdminConversationService.call({
      conversationId: uniqueId
    })

    return res.status(200).json({
      data: ChatbotConversationSerializer.serialize(conversation)
    })
  }

  // Get all messages for a conversation
  async getConversationMessages(req, res) {
    const { uniqueId } = req.params
    const { page, perPage } = req.query

    const result = await GetAdminConversationMessagesService.call({
      conversationId: uniqueId,
      page: parseInt(page) || 1,
      perPage: parseInt(perPage) || 50
    })

    return res.status(200).json({
      data: ChatbotMessageSerializer.serialize(result.messages),
      pagination: result.pagination
    })
  }

  // ---- Research Domains ----

  async getResearchDomains(req, res) {
    const { page = 1, perPage = 12, search = '' } = req.query
    const result = await GetResearchDomainsService.call({
      page: parseInt(page),
      perPage: parseInt(perPage),
      search
    })
    return res.status(200).json({ data: result })
  }

  async createResearchDomain(req, res) {
    const { domain, journal_name } = req.body
    const created = await CreateResearchDomainService.call({ domain, journal_name })
    return res.status(201).json({ data: created })
  }

  async updateResearchDomain(req, res) {
    const { id } = req.params
    const { is_active, journal_name } = req.body
    const updated = await UpdateResearchDomainService.call({ id, is_active, journal_name })
    return res.status(200).json({ data: updated })
  }

  async deleteResearchDomain(req, res) {
    const { id } = req.params
    await DeleteResearchDomainService.call({ id })
    return res.status(200).json({ data: { success: true } })
  }

  // ---- Journal Names ----

  async getJournals(req, res) {
    const { page = 1, perPage = 20, search = '' } = req.query
    const result = await GetJournalNamesService.call({ page: parseInt(page), perPage: parseInt(perPage), search })
    return res.status(200).json({ data: result })
  }

  async createJournal(req, res) {
    const { name } = req.body
    const journal = await CreateJournalNameService.call({ name })
    return res.status(201).json({ data: journal })
  }

  async updateJournal(req, res) {
    const { id } = req.params
    const { name, is_active } = req.body
    const journal = await UpdateJournalNameService.call({ id, name, is_active })
    return res.status(200).json({ data: journal })
  }

  async deleteJournal(req, res) {
    const { id } = req.params
    await DeleteJournalNameService.call({ id })
    return res.status(200).json({ data: { success: true } })
  }

  // Delete conversation (hard delete for admin)
  async deleteConversation(req, res) {
    const { uniqueId } = req.params

    await DeleteAdminConversationService.call({
      conversationId: uniqueId
    })

    return res.status(200).json({
      data: {
        success: true
      }
    })
  }
}

export default new ChatbotAdminController()
