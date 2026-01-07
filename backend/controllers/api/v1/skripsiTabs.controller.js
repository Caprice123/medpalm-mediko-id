import { GetTabMessagesService } from '#services/skripsi/getTabMessagesService'
import { SendMessageService } from '#services/skripsi/sendMessageService'
import prisma from '#prisma/client'

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

  // Save partial message when streaming is stopped
  async savePartialMessage(req, res) {
    const userId = req.user.id
    const tabId = parseInt(req.params.tabId)
    const { content } = req.body

    // Verify the tab belongs to the user
    const tab = await prisma.skripsi_tabs.findFirst({
      where: {
        id: tabId,
        skripsi_set: {
          user_id: userId
        }
      }
    })

    if (!tab) {
      return res.status(404).json({
        message: 'Tab not found or access denied'
      })
    }

    // Save the partial AI message to database
    const aiMessage = await prisma.skripsi_messages.create({
      data: {
        tab_id: tabId,
        sender_type: 'ai',
        content: content,
        created_at: new Date(),
        updated_at: new Date()
      }
    })

    return res.status(200).json({
      message: 'Partial message saved successfully',
      data: {
        id: aiMessage.id,
        sender_type: aiMessage.sender_type,
        content: aiMessage.content,
        created_at: aiMessage.created_at
      }
    })
  }
}

export default new SkripsiTabsController()
