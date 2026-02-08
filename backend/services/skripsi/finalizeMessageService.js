import prisma from '#prisma/client'
import { ValidationError } from '#errors/validationError'

export class FinalizeMessageService {
  static async call({ userId, tabId, messageId, content, isComplete }) {
    // Verify the tab belongs to a set owned by the user
    const tab = await prisma.skripsi_tabs.findFirst({
      where: {
        id: tabId
      },
      include: {
        skripsi_set: {
          select: {
            user_id: true
          }
        }
      }
    })

    if (!tab || tab.skripsi_set.user_id !== userId) {
      throw new ValidationError('Tab not found or access denied')
    }

    // Use transaction to prevent race condition
    const result = await prisma.$transaction(async (tx) => {
      // Re-read message with row lock
      const message = await tx.skripsi_messages.findFirst({
        where: {
          id: messageId,
          tab_id: tabId,
          sender_type: 'ai'
        },
        include: {
          skripsi_message_sources: true
        }
      })

      if (!message) {
        throw new ValidationError('Message not found or not an AI message')
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
      const updatedMessage = await tx.skripsi_messages.update({
        where: { id: messageId },
        data: {
          content: content, // Exact content from frontend
          status: isComplete ? 'completed' : 'truncated',
          updated_at: new Date()
        },
        include: {
          skripsi_message_sources: true
        }
      })

      console.log(`✅ Skripsi message finalized as '${updatedMessage.status}'`)
      return {
        success: true,
        message: updatedMessage
      }
    })

    return result
  }
}
