import { GetAdminConversationsService } from '#services/chatbot/admin/getAdminConversationsService'
import { GetAdminConversationService } from '#services/chatbot/admin/getAdminConversationService'
import { GetAdminConversationMessagesService } from '#services/chatbot/admin/getAdminConversationMessagesService'
import { DeleteAdminConversationService } from '#services/chatbot/admin/deleteAdminConversationService'

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
      success: true,
      data: result.data,
      pagination: result.pagination
    })
  }

  // Get conversation details
  async getConversation(req, res) {
    const { id } = req.params

    const conversation = await GetAdminConversationService.call({
      conversationId: parseInt(id)
    })

    return res.status(200).json({
      success: true,
      data: conversation
    })
  }

  // Get all messages for a conversation
  async getConversationMessages(req, res) {
    const { id } = req.params
    const { page, perPage } = req.query

    const result = await GetAdminConversationMessagesService.call({
      conversationId: parseInt(id),
      page: parseInt(page) || 1,
      perPage: parseInt(perPage) || 50
    })

    return res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination
    })
  }

  // Delete conversation (hard delete for admin)
  async deleteConversation(req, res) {
    const { id } = req.params

    await DeleteAdminConversationService.call({
      conversationId: parseInt(id)
    })

    return res.status(200).json({
      success: true,
      message: 'Conversation deleted successfully'
    })
  }
}

export default new ChatbotAdminController()
