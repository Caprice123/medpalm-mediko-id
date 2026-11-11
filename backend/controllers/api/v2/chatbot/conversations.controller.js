import { GetConversationsService } from '#services/chatbot/getConversationsService'
import { CreateConversationService } from '#services/chatbot/createConversationService'
import { GetConversationService } from '#services/chatbot/getConversationService'
import { UpdateConversationService } from '#services/chatbot/updateConversationService'
import { DeleteConversationService } from '#services/chatbot/deleteConversationService'
import { ChatbotConversationV2Serializer } from '#serializers/api/v2/chatbotConversationSerializer'

// Conversation CRUD is unchanged between V1 and V2 — the same services answer
// both. V2 only runs the result through its own serializer so the response shape
// is owned here and can move without touching the V1 page.
class ConversationV2Controller {
  async index(req, res) {
    const { page, perPage, search } = req.query

    const result = await GetConversationsService.call({
      userId: req.user.id,
      page: parseInt(page) || 1,
      perPage: parseInt(perPage) || 20,
      search,
    })

    return res.status(200).json({
      data: ChatbotConversationV2Serializer.serialize(result.data),
      pagination: result.pagination,
    })
  }

  async create(req, res) {
    const { topic, initialMode } = req.body

    const conversation = await CreateConversationService.call({
      userId: req.user.id,
      topic,
      initialMode,
    })

    return res.status(201).json({
      data: ChatbotConversationV2Serializer.serializeOne(conversation),
    })
  }

  async show(req, res) {
    const conversation = await GetConversationService.call({
      userId: req.user.id,
      conversationId: req.params.uniqueId,
    })

    return res.status(200).json({
      data: ChatbotConversationV2Serializer.serializeOne(conversation),
    })
  }

  async update(req, res) {
    const conversation = await UpdateConversationService.call({
      userId: req.user.id,
      conversationId: req.params.uniqueId,
      topic: req.body.topic,
    })

    return res.status(200).json({
      data: ChatbotConversationV2Serializer.serializeOne(conversation),
    })
  }

  async delete(req, res) {
    await DeleteConversationService.call({
      userId: req.user.id,
      conversationId: req.params.uniqueId,
    })

    return res.status(200).json({ data: { success: true } })
  }
}

export default new ConversationV2Controller()
