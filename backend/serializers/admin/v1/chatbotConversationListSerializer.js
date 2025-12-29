export class ChatbotConversationListSerializer {
  static serialize(conversations) {
    return conversations.map(conversation => ({
      id: conversation.id,
      topic: conversation.title,
      user: conversation.users ? {
        name: conversation.users.name,
        email: conversation.users.email
      } : null,
      messageCount: conversation._count?.chatbot_messages || conversation.messageCount || 0,
      createdAt: conversation.created_at,
      updatedAt: conversation.updated_at
    }))
  }
}
