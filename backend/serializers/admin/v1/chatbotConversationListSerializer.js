export class ChatbotConversationListSerializer {
  static serialize(conversations) {
    return conversations.map(conversation => ({
      id: conversation.id,
      uniqueId: conversation.unique_id,
      topic: conversation.topic || conversation.title,
      user: conversation.user || (conversation.users ? {
        id: conversation.users.id,
        name: conversation.users.name,
        email: conversation.users.email
      } : null),
      messageCount: conversation._count?.chatbot_messages || conversation.messageCount || 0,
      lastMessage: conversation.lastMessage || null,
      createdAt: conversation.createdAt || conversation.created_at,
      updatedAt: conversation.updatedAt || conversation.updated_at
    }))
  }
}
