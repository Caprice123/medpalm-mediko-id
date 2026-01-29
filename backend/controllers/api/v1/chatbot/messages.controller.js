import { GetMessagesService } from '#services/chatbot/getMessagesService'
import { SendMessageService } from '#services/chatbot/sendMessageService'
import { SubmitFeedbackService } from '#services/chatbot/submitFeedbackService'
import { TruncateMessageService } from '#services/chatbot/truncateMessageService'
import { FinalizeMessageService } from '#services/chatbot/finalizeMessageService'
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

    // Track if client disconnected and create AbortController for streaming
    let clientDisconnected = false
    const streamAbortController = new AbortController()

    req.on('close', () => {
      console.log('🔴 req.on("close") fired - Client disconnected')
      clientDisconnected = true
      streamAbortController.abort() // Abort the AI stream
    })

    // Also listen to other disconnection events
    res.on('close', () => {
      console.log('🔴 res.on("close") fired - Response stream closed')
      clientDisconnected = true
      streamAbortController.abort()
    })

    res.on('finish', () => {
      console.log('🟢 res.on("finish") fired - Response finished normally')
    })

    res.on('error', (err) => {
      console.log('🔴 res.on("error") fired:', err.message)
      clientDisconnected = true
      streamAbortController.abort()
    })

    try {
      await SendMessageService.call({
        userId,
        conversationId: parseInt(conversationId),
        message,
        mode,
        streamAbortSignal: streamAbortController.signal, // Pass abort signal
        checkClientConnected: () => !clientDisconnected, // Function to check if client still connected
        onStream: (chunk, onSend) => {
          // Only send if client still connected
          if (!clientDisconnected) {
            res.write(`data: ${JSON.stringify(chunk)}\n\n`)
            onSend()
          }
        },
        onComplete: (result) => {
          // Only send final result if client still connected
          if (!clientDisconnected) {
            res.write(`data: ${JSON.stringify({ type: 'done', data: result })}\n\n`)
            res.end()
          }
        },
        onError: (error) => {
          if (!clientDisconnected) {
            res.write(`data: ${JSON.stringify({ type: 'error', error: error.message })}\n\n`)
            res.end()
          }
        }
      })
    } catch (error) {
      if (!clientDisconnected) {
        res.write(`data: ${JSON.stringify({ type: 'error', error: error.message })}\n\n`)
        res.end()
      }
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
    const { content, modeType, userMessage } = req.body

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

    // Save the user message first (if provided)
    let savedUserMessage = null
    if (userMessage) {
      savedUserMessage = await prisma.chatbot_messages.create({
        data: {
          conversation_id: conversationId,
          sender_type: 'user',
          mode_type: null,
          content: userMessage,
          credits_used: 0,
          created_at: new Date()
        }
      })
    }

    // Save the partial AI message to database
    const aiMessage = await prisma.chatbot_messages.create({
      data: {
        conversation_id: conversationId,
        sender_type: 'ai',
        mode_type: modeType,
        content: content,
        credits_used: 0, // Credits not deducted for stopped messages
        created_at: new Date()
      }
    })

    // Fetch the messages with proper timestamps
    const userMsgWithTimestamp = savedUserMessage ? await prisma.chatbot_messages.findUnique({
      where: { id: savedUserMessage.id }
    }) : null

    const aiMsgWithTimestamp = await prisma.chatbot_messages.findUnique({
      where: { id: aiMessage.id }
    })

    return res.status(200).json({
      message: 'Partial message saved successfully',
      data: {
        userMessage: userMsgWithTimestamp ? {
          id: userMsgWithTimestamp.id,
          senderType: userMsgWithTimestamp.sender_type,
          content: userMsgWithTimestamp.content,
          createdAt: userMsgWithTimestamp.created_at.toISOString()
        } : null,
        aiMessage: {
          id: aiMsgWithTimestamp.id,
          senderType: aiMsgWithTimestamp.sender_type,
          modeType: aiMsgWithTimestamp.mode_type,
          content: aiMsgWithTimestamp.content,
          sources: [],
          createdAt: aiMsgWithTimestamp.created_at.toISOString()
        }
      }
    })
  }

  // Finalize message content (called by frontend for both completed and truncated)
  async finalize(req, res) {
    const userId = req.user.id
    const { conversationId, messageId } = req.params
    const { content, isComplete } = req.body

    if (typeof content !== 'string') {
      return res.status(400).json({
        message: 'Content is required and must be a string'
      })
    }

    try {
      const result = await FinalizeMessageService.call({
        userId,
        conversationId: parseInt(conversationId),
        messageId: parseInt(messageId),
        content: content,
        isComplete: isComplete === true
      })

      if (!result.success) {
        return res.status(409).json({
          message: result.note || 'Message already finalized',
          data: {
            id: result.message.id,
            content: result.message.content,
            status: result.message.status,
            createdAt: result.message.created_at.toISOString()
          }
        })
      }

      return res.status(200).json({
        message: 'Message finalized successfully',
        data: {
          id: result.message.id,
          content: result.message.content,
          status: result.message.status,
          createdAt: result.message.created_at.toISOString()
        }
      })
    } catch (error) {
      console.error('Error finalizing message:', error)
      return res.status(500).json({
        message: error.message || 'Failed to finalize message'
      })
    }
  }

  // Truncate message content when user stops streaming (DEPRECATED - use finalize)
  async truncate(req, res) {
    const userId = req.user.id
    const { conversationId, messageId } = req.params
    const { characterCount } = req.body

    if (!characterCount || characterCount < 0) {
      return res.status(400).json({
        message: 'Invalid character count'
      })
    }

    const result = await TruncateMessageService.call({
      userId,
      conversationId: parseInt(conversationId),
      messageId: parseInt(messageId),
      characterCount: parseInt(characterCount)
    })
    console.log(result.message)

    return res.status(200).json({
      message: 'Message truncated successfully',
      data: {
        id: result.message.id,
        content: result.message.content,
        createdAt: result.message.created_at.toISOString()
      }
    })
  }
}

export default new MessageController()
