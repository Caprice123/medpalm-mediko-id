import prisma from '#prisma/client'
import { ValidationError } from '#errors/validationError'

export class TruncateMessageService {
  static async call({ userId, conversationId, messageId, characterCount }) {
    // Verify the conversation belongs to the user
    const conversation = await prisma.chatbot_conversations.findFirst({
      where: {
        unique_id: conversationId,
        user_id: userId
      },
      select: { id: true }
    })

    if (!conversation) {
      throw new ValidationError('Conversation not found or access denied')
    }

    const internalConversationId = conversation.id

    // Find the AI message
    const message = await prisma.chatbot_messages.findFirst({
      where: {
        id: messageId,
        conversation_id: internalConversationId,
        sender_type: 'ai'
      }
    })

    if (!message) {
      throw new ValidationError('Message not found or not an AI message')
    }

    // Truncate the content to the specified character count
    const truncatedContent = message.content.substring(0, characterCount)

    // Update the message in database
    const updatedMessage = await prisma.chatbot_messages.update({
      where: { id: messageId },
      data: {
        content: truncatedContent,
      }
    })

    return {
      success: true,
      message: updatedMessage
    }
  }
}
