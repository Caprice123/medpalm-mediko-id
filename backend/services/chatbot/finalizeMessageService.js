import prisma from '#prisma/client'

export class FinalizeMessageService {
  static async call({ userId, conversationId, messageId, content, isComplete }) {
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

    // Use transaction to prevent race condition
    const result = await prisma.$transaction(async (tx) => {
      // Re-read message with row lock
      const message = await tx.chatbot_messages.findFirst({
        where: {
          id: messageId,
          conversation_id: conversationId,
          sender_type: 'ai'
        }
      })

      if (!message) {
        throw new Error('Message not found or not an AI message')
      }

      // Check if status is still 'streaming'
      if (message.status !== 'streaming') {
        console.log(`⚠️ Cannot finalize - message status is '${message.status}'`)
        return {
          success: false,
          message: message,
          note: `Already ${message.status}`
        }
      }

      // Save the exact content from frontend
      const updatedMessage = await tx.chatbot_messages.update({
        where: { id: messageId },
        data: {
          content: content, // Exact content from frontend
          status: isComplete ? 'completed' : 'truncated'
        }
      })

      // Update conversation's last_message (trimmed to 50 chars)
      await tx.chatbot_conversations.update({
        where: { id: conversationId },
        data: {
          last_message: content.substring(0, 50),
          updated_at: new Date()
        }
      })

      console.log(`✅ Message finalized as '${updatedMessage.status}'`)
      return {
        success: true,
        message: updatedMessage
      }
    })

    return result
  }
}
