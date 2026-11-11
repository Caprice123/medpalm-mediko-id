import { toJakartaISO } from '#utils/dateUtils'

// Unlike V1 this keeps `status` ('streaming' | 'completed' | 'truncated' |
// 'error'), without which a reload cannot tell an answer the user stopped from
// one that finished. V1's version also logged every message to the console on
// the way through, twice; that is gone.
export class SkripsiMessageV2Serializer {
  static serialize(messages) {
    return messages.map(msg => SkripsiMessageV2Serializer.serializeOne(msg))
  }

  static serializeOne(msg) {
    return {
      id: msg.id,
      senderType: msg.sender_type ?? msg.senderType,
      modeType: msg.mode_type ?? msg.modeType,
      content: msg.content,
      status: msg.status ?? null,
      sources: (msg.skripsi_message_sources || msg.sources || []).map(src => ({
        url: src.url,
        title: src.title,
      })),
      createdAt: toJakartaISO(msg.created_at ?? msg.createdAt),
      updatedAt: toJakartaISO(msg.updated_at ?? msg.updatedAt),
    }
  }
}
