import { GetMessagesService } from '#services/chatbot/getMessagesService'
import { SendMessageService } from '#services/chatbot/sendMessageService'
import { SubmitFeedbackService } from '#services/chatbot/submitFeedbackService'

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
      data: result.data,
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
}

export default new MessageController()
