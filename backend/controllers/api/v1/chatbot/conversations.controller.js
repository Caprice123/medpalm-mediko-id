import { GetConversationsService } from '#services/chatbot/getConversationsService'
import { CreateConversationService } from '#services/chatbot/createConversationService'
import { GetConversationService } from '#services/chatbot/getConversationService'
import { UpdateConversationService } from '#services/chatbot/updateConversationService'
import { DeleteConversationService } from '#services/chatbot/deleteConversationService'

class ConversationController {
  // Get user's conversations
  async index(req, res) {
    const userId = req.user.id
    const { page, perPage, search } = req.query

    const result = await GetConversationsService.call({
      userId,
      page: parseInt(page) || 1,
      perPage: parseInt(perPage) || 20,
      search
    })

    return res.status(200).json({
      data: result.data,
      pagination: result.pagination
    })
  }

  // Create a new conversation
  async create(req, res) {
    const userId = req.user.id
    const { topic, initialMode } = req.body

    const conversation = await CreateConversationService.call({
      userId,
      topic,
      initialMode
    })

    return res.status(201).json({
      data: conversation,
    })
  }

  // Get conversation details with messages
  async show(req, res) {
    const userId = req.user.id
    const { uniqueId } = req.params

    const conversation = await GetConversationService.call({
      userId,
      conversationId: uniqueId
    })

    return res.status(200).json({
      data: conversation
    })
  }

  // Update conversation (rename topic)
  async update(req, res) {
    const userId = req.user.id
    const { uniqueId } = req.params
    const { topic } = req.body

    const conversation = await UpdateConversationService.call({
      userId,
      conversationId: uniqueId,
      topic
    })

    return res.status(200).json({
      data: conversation,
    })
  }

  // Delete conversation (soft delete)
  async delete(req, res) {
    const userId = req.user.id
    const { uniqueId } = req.params

    await DeleteConversationService.call({
      userId,
      conversationId: uniqueId
    })

    return res.status(200).json({
        data: {
            success: true,
        }
    })
  }
}

export default new ConversationController()
