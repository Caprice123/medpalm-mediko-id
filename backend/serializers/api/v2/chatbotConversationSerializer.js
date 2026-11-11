import { toJakartaISO } from '#utils/dateUtils'

export class ChatbotConversationV2Serializer {
  static serialize(conversations) {
    return conversations.map(conv => ChatbotConversationV2Serializer.serializeOne(conv))
  }

  static serializeOne(conv) {
    return {
      id: conv.id,
      uniqueId: conv.uniqueId || conv.unique_id,
      topic: conv.topic,
      lastMessage: conv.lastMessage ?? conv.last_message ?? null,
      createdAt: toJakartaISO(conv.createdAt || conv.created_at),
      updatedAt: toJakartaISO(conv.updatedAt || conv.updated_at),
    }
  }
}
