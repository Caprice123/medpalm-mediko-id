import { toJakartaISO } from '#utils/dateUtils'

// V2 message shape. Two fields the V1 serializer dropped are carried here
// because the V2 reader actually reads them:
//   - `status`  — 'streaming' | 'completed' | 'truncated' | 'error'. Without it a
//                 reload could not tell a truncated answer from a finished one.
//   - `myFeedback` — the signed-in user's own thumbs value. GetMessagesService
//                 already loads it per user; V1 fetched and then discarded it,
//                 so the feedback buttons reset on every reload.
export class ChatbotMessageV2Serializer {
  static serialize(messages) {
    return messages.map(msg => ChatbotMessageV2Serializer.serializeOne(msg))
  }

  static serializeOne(msg) {
    const feedbacks = msg.chatbot_message_feedbacks || msg.feedbacks || []
    const own = feedbacks.length > 0 ? feedbacks[0] : null

    return {
      id: msg.id,
      senderType: msg.sender_type || msg.senderType,
      modeType: msg.mode_type || msg.modeType,
      content: msg.content,
      status: msg.status || null,
      sources: (msg.chatbot_message_sources || msg.sources || []).map(src => ({
        url: src.url,
        title: src.title,
      })),
      myFeedback: own ? { isHelpful: own.is_helpful, feedback: own.feedback || null } : null,
      createdAt: toJakartaISO(msg.created_at || msg.createdAt),
    }
  }
}
