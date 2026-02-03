import prisma from '#prisma/client'
import { ValidationError } from '#errors/validationError'

export class TruncateMessageService {
  static async call({ userId, tabId, messageId, characterCount }) {
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

    // Find the AI message
    const message = await prisma.skripsi_messages.findFirst({
      where: {
        id: messageId,
        tab_id: tabId,
        sender_type: 'ai'
      }
    })

    if (!message) {
      throw new ValidationError('Message not found or not an AI message')
    }

    // Truncate the content to the specified character count
    const truncatedContent = message.content.substring(0, characterCount)

    // Update the message in database
    const updatedMessage = await prisma.skripsi_messages.update({
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
