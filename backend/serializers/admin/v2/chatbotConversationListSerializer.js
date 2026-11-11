import { toJakartaISO } from '#utils/dateUtils'

export class ChatbotConversationListV2Serializer {
  static serialize(conversations) {
    return conversations.map(conv => ({
      id: conv.id,
      // The identifier every admin action addresses — see
      // GetAdminConversationsV2Service for why V1 lost it.
      uniqueId: conv.unique_id,
      topic: conv.topic,
      user: conv.users
        ? { id: conv.users.id, name: conv.users.name, email: conv.users.email }
        : null,
      messageCount: conv._count?.chatbot_messages ?? 0,
      lastMessage: conv.last_message || null,
      createdAt: toJakartaISO(conv.created_at),
      updatedAt: toJakartaISO(conv.updated_at),
    }))
  }
}
