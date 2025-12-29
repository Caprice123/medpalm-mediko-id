export class ChatbotMessageSerializer {
  static serialize(messages) {
    return messages.map(msg => ({
      id: msg.id,
      senderType: msg.sender_type || msg.senderType,
      modeType: msg.mode_type || msg.modeType,
      content: msg.content,
      creditsUsed: msg.credits_used || msg.creditsUsed,
      sources: (msg.chatbot_message_sources || msg.sources || []).map(src => ({
        id: src.id,
        sourceType: src.source_type || src.sourceType,
        title: src.title,
        url: src.url
      })),
      createdAt: msg.created_at || msg.createdAt
    }))
  }
}
