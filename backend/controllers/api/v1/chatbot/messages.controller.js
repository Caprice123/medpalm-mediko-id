import { GetMessagesService } from '#services/chatbot/getMessagesService'
import { SendMessageService } from '#services/chatbot/sendMessageService'
import { SubmitFeedbackService } from '#services/chatbot/submitFeedbackService'
import { ChatbotMessageSerializer } from '#serializers/api/v1/chatbotMessageSerializer'
import prisma from '#prisma/client'

class MessageController {
  // Get messages for a conversation
  async index(req, res) {
    const userId = req.user.id
    const { conversationId } = req.params
    const { page, perPage } = req.query

    const result = await GetMessagesService.call({
      userId,
      conversationId: parseInt(conversationId),
      page: parseInt(page) || 1,
      perPage: parseInt(perPage) || 50
    })

    return res.status(200).json({
      data: ChatbotMessageSerializer.serialize(result.messages),
      pagination: result.pagination
    })
  }

  // Send a message and get AI response (with streaming support)
  async create(req, res) {
    const userId = req.user.id
    const { conversationId } = req.params
    const { message, mode } = req.body

    // Set headers for Server-Sent Events
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    try {
      await SendMessageService.call({
        userId,
        conversationId: parseInt(conversationId),
        message,
        mode,
        onStream: (chunk) => {
          // Send streaming chunk to client
          res.write(`data: ${JSON.stringify(chunk)}\n\n`)
        },
        onComplete: (result) => {
          // Send final result
          res.write(`data: ${JSON.stringify({ type: 'done', data: result })}\n\n`)
          res.end()
        },
        onError: (error) => {
          res.write(`data: ${JSON.stringify({ type: 'error', error: error.message })}\n\n`)
          res.end()
        }
      })
    } catch (error) {
      res.write(`data: ${JSON.stringify({ type: 'error', error: error.message })}\n\n`)
      res.end()
    }
  }

  // Submit feedback for a message
  async feedback(req, res) {
    const userId = req.user.id
    const { messageId } = req.params
    const { isHelpful, feedback } = req.body

    await SubmitFeedbackService.call({
      userId,
      messageId: parseInt(messageId),
      isHelpful,
      feedback
    })

    return res.status(200).json({
        data: {
            success: true
        }
    })
  }

  // Save partial message when streaming is stopped
  async savePartialMessage(req, res) {
    const userId = req.user.id
    const conversationId = parseInt(req.params.conversationId)
    const { content, modeType } = req.body

    // Verify the conversation belongs to the user
    const conversation = await prisma.chatbot_conversations.findFirst({
      where: {
        id: conversationId,
        user_id: userId
      }
    })

    if (!conversation) {
      return res.status(404).json({
        message: 'Conversation not found or access denied'
      })
    }

    // Save the partial AI message to database
    const aiMessage = await prisma.chatbot_messages.create({
      data: {
        conversation_id: conversationId,
        sender_type: 'ai',
        mode_type: modeType,
        content: content,
        created_at: new Date(),
        updated_at: new Date()
      }
    })

    return res.status(200).json({
      message: 'Partial message saved successfully',
      data: {
        id: aiMessage.id,
        senderType: aiMessage.sender_type,
        modeType: aiMessage.mode_type,
        content: aiMessage.content,
        sources: [],
        createdAt: aiMessage.created_at
      }
    })
  }
}

export default new MessageController()
