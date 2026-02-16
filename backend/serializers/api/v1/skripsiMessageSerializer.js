export class SkripsiMessageSerializer {
  static serialize(messages) {
    return messages.map(msg => {
      console.log('📝 Original message:', {
        id: msg.id,
        sender_type: msg.sender_type,
        senderType: msg.senderType,
        created_at: msg.created_at,
        createdAt: msg.createdAt
      })

      const serialized = {
        id: msg.id,
        senderType: msg.sender_type || msg.senderType,
        content: msg.content,
        modeType: msg.mode_type || msg.modeType, // Include mode type (research/validated)
        sources: (msg.skripsi_message_sources || msg.sources || []).map(src => ({
          url: src.url,
          title: src.title
        })),
        createdAt: msg.created_at || msg.createdAt
      }

      console.log('✅ Serialized message:', serialized)
      return serialized
    })
  }
}
