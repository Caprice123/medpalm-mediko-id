import { GetTabMessagesService } from '#services/skripsi/getTabMessagesService'
import { SendMessageService } from '#services/skripsi/sendMessageService'
import { TruncateMessageService } from '#services/skripsi/truncateMessageService'
import { FinalizeMessageService } from '#services/skripsi/finalizeMessageService'
import { SaveTabDiagramService } from '#services/skripsi/saveTabDiagramService'
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

    // Track if client disconnected and create AbortController for streaming
    let clientDisconnected = false
    const streamAbortController = new AbortController()

    // Detect when client disconnects (e.g., clicks stop button or closes tab)
    req.on('close', () => {
      console.log('🔴 req.on("close") fired - Client disconnected')
      clientDisconnected = true
      streamAbortController.abort() // Abort the AI stream
    })

    res.on('close', () => {
      console.log('🔴 res.on("close") fired - Response stream closed')
      clientDisconnected = true
      streamAbortController.abort()
    })

    // Handle response errors
    res.on('error', (err) => {
      console.log('🔴 res.on("error") fired:', err.message)
      clientDisconnected = true
      streamAbortController.abort()
    })

    try {
      await SendMessageService.call({
        tabId,
        userId,
        message,
        streamAbortSignal: streamAbortController.signal,
        checkClientConnected: () => !clientDisconnected,
        onStream: (chunk, onSend) => {
          // Only send if client still connected
          if (!clientDisconnected) {
            res.write(`data: ${JSON.stringify(chunk)}\n\n`)
            if (onSend) onSend() // Call callback if provided
          }
        },
        onComplete: (result) => {
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

  // Finalize message content (called by frontend for both completed and truncated)
  async finalizeMessage(req, res) {
    const userId = req.user.id
    const { tabId, messageId } = req.params
    const { content, isComplete } = req.body

    if (typeof content !== 'string') {
      return res.status(400).json({
        message: 'Content is required and must be a string'
      })
    }

    try {
      const result = await FinalizeMessageService.call({
        userId,
        tabId: parseInt(tabId),
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
            updatedAt: result.message.updated_at.toISOString()
          }
        })
      }

      return res.status(200).json({
        message: 'Message finalized successfully',
        data: {
          id: result.message.id,
          content: result.message.content,
          status: result.message.status,
          updatedAt: result.message.updated_at.toISOString()
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
  async truncateMessage(req, res) {
    const userId = req.user.id
    const { tabId, messageId } = req.params
    const { characterCount } = req.body

    if (!characterCount || characterCount < 0) {
      return res.status(400).json({
        message: 'Invalid character count'
      })
    }

    try {
      const result = await TruncateMessageService.call({
        userId,
        tabId: parseInt(tabId),
        messageId: parseInt(messageId),
        characterCount: parseInt(characterCount)
      })

      return res.status(200).json({
        message: 'Message truncated successfully',
        data: {
          id: result.message.id,
          content: result.message.content,
          updatedAt: result.message.updated_at.toISOString()
        }
      })
    } catch (error) {
      return res.status(404).json({
        message: error.message
      })
    }
  }

  // Save/update diagram data to tab content (for auto-save and post-generation)
  async saveDiagram(req, res) {
    const userId = req.user.id
    const { tabId } = req.params
    const { diagramData } = req.body

    if (!diagramData) {
      return res.status(400).json({
        message: 'Diagram data is required'
      })
    }

    try {
      const result = await SaveTabDiagramService.call({
        tabId: parseInt(tabId),
        userId,
        diagramData
      })

      return res.status(200).json({
        message: 'Diagram saved successfully',
        data: result
      })
    } catch (error) {
      return res.status(error.message === 'Tab not found or access denied' ? 404 : 400).json({
        message: error.message
      })
    }
  }
}

export default new SkripsiTabsController()
