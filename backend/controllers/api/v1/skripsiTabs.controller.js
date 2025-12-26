import { GetTabMessagesService } from '../../../services/skripsi/getTabMessagesService.js'
import { SendMessageService } from '../../../services/skripsi/sendMessageService.js'

class SkripsiTabsController {
  // Get messages for a tab with pagination
  async getMessages(req, res) {
    const userId = req.user.id
    const tabId = parseInt(req.params.tabId)
    const { limit, beforeMessageId } = req.query

    const result = await GetTabMessagesService.call({
      tabId,
      userId,
      limit: parseInt(limit) || 50,
      beforeMessageId: beforeMessageId ? parseInt(beforeMessageId) : null
    })

    return res.status(200).json({
      success: true,
      data: result.messages,
      hasMore: result.hasMore
    })
  }

  // Send a message and get AI response (with streaming)
  async sendMessage(req, res) {
    const userId = req.user.id
    const tabId = parseInt(req.params.id)
    const { message } = req.body

    // Set headers for Server-Sent Events (SSE)
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    const onStream = (data) => {
      res.write(`data: ${JSON.stringify(data)}\n\n`)
    }

    const onComplete = (data) => {
      res.write(`data: ${JSON.stringify({ type: 'done', data })}\n\n`)
      res.end()
    }

    const onError = (error) => {
      res.write(`data: ${JSON.stringify({ type: 'error', error: error.message })}\n\n`)
      res.end()
    }

    await SendMessageService.call({
      tabId,
      userId,
      message,
      onStream,
      onComplete,
      onError
    })
  }
}

export default new SkripsiTabsController()
