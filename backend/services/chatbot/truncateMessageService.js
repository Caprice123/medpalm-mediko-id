import prisma from '#prisma/client'

export class TruncateMessageService {
  static async call({ userId, conversationId, messageId, characterCount }) {
    // Verify the conversation belongs to the user
    const conversation = await prisma.chatbot_conversations.findFirst({
      where: {
        id: conversationId,
        user_id: userId
      }
    })

    if (!conversation) {
      throw new Error('Conversation not found or access denied')
    }

    // Find the AI message
    const message = await prisma.chatbot_messages.findFirst({
      where: {
        id: messageId,
        conversation_id: conversationId,
        sender_type: 'ai'
      }
    })

    if (!message) {
      throw new Error('Message not found or not an AI message')
    }

    // Truncate the content to the specified character count
    const truncatedContent = message.content.substring(0, characterCount)

    // Update the message in database
    const updatedMessage = await prisma.chatbot_messages.update({
      where: { id: messageId },
      data: {
        content: truncatedContent,
        updated_at: new Date()
      }
    })

    return {
      success: true,
      message: updatedMessage
    }
  }
}
