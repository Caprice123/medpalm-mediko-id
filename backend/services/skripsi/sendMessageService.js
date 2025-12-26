import prisma from '../../prisma/client.js'
import { BaseService } from '../baseService.js'
import { NotFoundError } from '../../errors/notFoundError.js'
import { ValidationError } from '../../errors/validationError.js'
import { SkripsiAIService } from './ai/skripsiAIService.js'

export class SendMessageService extends BaseService {
  static async call({ tabId, userId, message, onStream, onComplete, onError }) {
    if (!message || message.trim() === '') {
      throw new ValidationError('Message cannot be empty')
    }

    // Verify ownership through the set
    const tab = await prisma.skripsi_tabs.findFirst({
      where: {
        id: tabId
      },
      include: {
        skripsi_set: true
      }
    })

    if (!tab || tab.skripsi_set.user_id !== userId) {
      throw new NotFoundError('Tab not found')
    }

    // Get AI response with streaming
    try {
      const result = await SkripsiAIService.call({
        tabId,
        message: message.trim(),
        tabType: tab.tab_type
      })

      // Handle streaming response
      if (onStream && result.stream) {
        return await this.handleStreamingResponse({
          tabId,
          setId: tab.set_id,
          userMessageContent: message.trim(),
          stream: result.stream,
          onStream,
          onComplete,
          onError
        })
      }

      // Non-streaming fallback (shouldn't reach here with current implementation)
      throw new Error('Streaming is required for Skripsi Builder')
    } catch (error) {
      if (onError) {
        onError(error)
        return
      }
      throw error
    }
  }

  /**
   * Handle streaming response from Gemini
   */
  static async handleStreamingResponse({ tabId, setId, userMessageContent, stream, onStream, onComplete, onError }) {
    try {
      let fullResponse = ''

      // Process Gemini stream chunks
      for await (const chunk of stream) {
        const text = chunk.text()

        if (text) {
          fullResponse += text

          // Send chunk to client
          onStream({
            type: 'chunk',
            data: {
              content: text
            }
          })
        }
      }

      // Streaming complete - NOW save messages to database
      const userMessage = await prisma.skripsi_messages.create({
        data: {
          tab_id: tabId,
          sender_type: 'user',
          content: userMessageContent
        }
      })

      const aiMessage = await prisma.skripsi_messages.create({
        data: {
          tab_id: tabId,
          sender_type: 'ai',
          content: fullResponse
        }
      })

      // Update tab and set timestamps
      await prisma.skripsi_tabs.update({
        where: { id: tabId },
        data: { updated_at: new Date() }
      })

      await prisma.skripsi_sets.update({
        where: { id: setId },
        data: { updated_at: new Date() }
      })

      // Send completion
      onComplete({
        userMessage: {
          id: userMessage.id,
          sender_type: userMessage.sender_type,
          content: userMessage.content,
          created_at: userMessage.created_at
        },
        aiMessage: {
          id: aiMessage.id,
          sender_type: aiMessage.sender_type,
          content: aiMessage.content,
          created_at: aiMessage.created_at
        }
      })
    } catch (error) {
      console.error('Streaming error:', error)
      if (onError) {
        onError(error)
      }
    }
  }
}
