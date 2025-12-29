export class ChatbotConversationSerializer {
  static serialize(conversation) {
    const messages = conversation.chatbot_messages || conversation.messages || []

    return {
      id: conversation.id,
      topic: conversation.title,
      mode: conversation.mode,
      userId: conversation.user_id,
      user: conversation.users ? {
        id: conversation.users.id,
        name: conversation.users.name,
        email: conversation.users.email
      } : null,
      createdAt: conversation.created_at,
      updatedAt: conversation.updated_at,
      messages: messages.map((msg, index) => ({
        id: msg.id,
        content: msg.content,
        senderType: msg.sender_type,
        order: msg.order !== undefined ? msg.order : index,
        createdAt: msg.created_at
      })),
      messageCount: messages.length
    }
  }
}
