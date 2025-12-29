export class ChatbotMessageSerializer {
  static serialize(messages) {
    return messages.map(msg => ({
      id: msg.id,
      senderType: msg.sender_type || msg.senderType,
      modeType: msg.mode_type || msg.modeType,
      content: msg.content,
      sources: (msg.chatbot_message_sources || msg.sources || []).map(src => ({
        url: src.url,
        title: src.title
      })),
      createdAt: msg.created_at || msg.createdAt
    }))
  }
}
