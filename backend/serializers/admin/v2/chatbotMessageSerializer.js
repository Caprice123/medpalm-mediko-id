import { toJakartaISO } from '#utils/dateUtils'

// The admin reader shows what a student was actually answered with, so unlike
// the user-facing serializer it keeps the cost and the full source records.
export class ChatbotMessageAdminV2Serializer {
  static serialize(messages) {
    return messages.map(msg => ({
      id: msg.id,
      senderType: msg.sender_type,
      modeType: msg.mode_type,
      content: msg.content,
      status: msg.status || null,
      creditsUsed: msg.credits_used ?? 0,
      sources: (msg.chatbot_message_sources || []).map(src => ({
        id: src.id,
        sourceType: src.source_type,
        title: src.title,
        url: src.url,
        score: src.score ?? null,
      })),
      createdAt: toJakartaISO(msg.created_at),
    }))
  }
}
