/**
 * Skripsi Builder Streaming Hooks
 *
 * Feature-specific handlers for skripsi streaming:
 * - Message saving to skripsi_messages table
 * - Tab and set updates
 * - Citation handling for Perplexity
 */

import prisma from '#prisma/client'
import { StreamingHandler } from '#utils/aiUtils/streamingHandler'

/**
 * Hooks for Gemini streaming
 */
export class SkripsiGeminiHooks {
  /**
   * Before streaming: Create message records
   */
  static async beforeStreaming({ tabId }) {
    // CREATE MESSAGE RECORDS FIRST (before streaming)
    const userMessage = await prisma.skripsi_messages.create({
      data: {
        tab_id: tabId,
        sender_type: 'user',
        content: '', // Will be set by caller
        status: 'completed',
        created_at: new Date()
      }
    })

    const aiMessage = await prisma.skripsi_messages.create({
      data: {
        tab_id: tabId,
        sender_type: 'ai',
        content: '', // Empty initially
        status: 'streaming', // Mark as streaming
        created_at: new Date()
      }
    })

    return {
      userMessage: {
        id: userMessage.id,
        senderType: userMessage.sender_type,
        content: userMessage.content,
        createdAt: userMessage.created_at.toISOString()
      },
      aiMessage: {
        id: aiMessage.id,
        senderType: aiMessage.sender_type,
        content: aiMessage.content,
        createdAt: aiMessage.created_at.toISOString()
      },
      _raw: {
        userMessage,
        aiMessage
      }
    }
  }

  /**
   * On first chunk: Send message IDs to frontend
   */
  static async onFirstChunk({ messageRecords, newBalance, onStream }) {
    // SEND MESSAGE IDs IMMEDIATELY to frontend
    try {
      onStream({
        type: 'started',
        data: {
          userMessage: messageRecords.userMessage,
          aiMessage: messageRecords.aiMessage,
          userQuota: newBalance !== null ? { balance: newBalance } : null
        }
      })
      console.log('✅ Sent message IDs to frontend:', {
        userMessageId: messageRecords.userMessage.id,
        aiMessageId: messageRecords.aiMessage.id
      })
    } catch (e) {
      console.log('Could not send started event - client disconnected')
    }
  }

  /**
   * After streaming: Update tab and set timestamps
   */
  static async afterStreaming({ tabId, setId }) {
    // DON'T save to database yet - let frontend finalize
    // Message stays in 'streaming' status until frontend calls /finalize
    console.log('⏸️  Not saving to DB - waiting for frontend to finalize')

    // Update tab and set timestamps
    await prisma.skripsi_tabs.update({
      where: { id: tabId },
      data: { updated_at: new Date() }
    })

    await prisma.skripsi_sets.update({
      where: { id: setId },
      data: { updated_at: new Date() }
    })
  }
}

/**
 * Hooks for Perplexity streaming
 */
export class SkripsiPerplexityHooks {
  /**
   * Before streaming: Create message records
   */
  static async beforeStreaming({ tabId, userMessageContent }) {
    // CREATE MESSAGE RECORDS FIRST (before streaming)
    const userMessage = await prisma.skripsi_messages.create({
      data: {
        tab_id: tabId,
        sender_type: 'user',
        content: userMessageContent,
        status: 'completed',
        created_at: new Date()
      }
    })

    const aiMessage = await prisma.skripsi_messages.create({
      data: {
        tab_id: tabId,
        sender_type: 'ai',
        content: '', // Empty initially
        status: 'streaming', // Mark as streaming
        created_at: new Date()
      }
    })

    return {
      userMessage: {
        id: userMessage.id,
        senderType: userMessage.sender_type,
        content: userMessage.content,
        createdAt: userMessage.created_at.toISOString()
      },
      aiMessage: {
        id: aiMessage.id,
        senderType: aiMessage.sender_type,
        content: aiMessage.content,
        createdAt: aiMessage.created_at.toISOString()
      },
      _raw: {
        userMessage,
        aiMessage
      }
    }
  }

  /**
   * On first chunk: Send message IDs to frontend
   */
  static async onFirstChunk({ messageRecords, newBalance, onStream }) {
    // SEND MESSAGE IDs IMMEDIATELY to frontend
    try {
      onStream({
        type: 'started',
        data: {
          userMessage: messageRecords.userMessage,
          aiMessage: messageRecords.aiMessage,
          userQuota: newBalance !== null ? { balance: newBalance } : null
        }
      })
      console.log('✅ Sent message IDs to frontend:', {
        userMessageId: messageRecords.userMessage.id,
        aiMessageId: messageRecords.aiMessage.id
      })
    } catch (e) {
      console.log('Could not send started event - client disconnected')
    }
  }

  /**
   * Content filter: Remove <think> tags from Perplexity responses
   */
  static contentFilter(text, state) {
    return StreamingHandler.filterThinkTags(text, state)
  }

  /**
   * On citation: Handle citations from Perplexity
   */
  static async onCitation({ citation }) {
    // Citations are sent to client in real-time by StreamingHandler
    // No additional processing needed here
    console.log('📎 Citation received:', citation.url)
  }

  /**
   * After streaming: Save citations, update timestamps
   */
  static async afterStreaming({ messageRecords, tabId, setId, citations }) {
    // DON'T save to database yet - let frontend finalize
    // Message stays in 'streaming' status until frontend calls /finalize
    console.log('⏸️  Not saving to DB - waiting for frontend to finalize')

    // Save citations if any
    if (citations && citations.length > 0) {
      // Remove duplicates based on URL
      const uniqueCitations = Array.from(
        new Map(citations.map(c => [c.url, c])).values()
      )

      await prisma.skripsi_message_sources.createMany({
        data: uniqueCitations.slice(0, 10).map((citation, index) => ({
          message_id: messageRecords.aiMessage.id,
          source_type: 'web_search',
          title: citation.title || citation.url.substring(0, 200),
          content: citation.date || citation.url.substring(0, 500),
          url: citation.url,
          score: 1.0 - (index * 0.1)
        }))
      })
    }

    // Update tab and set timestamps
    await prisma.skripsi_tabs.update({
      where: { id: tabId },
      data: { updated_at: new Date() }
    })

    await prisma.skripsi_sets.update({
      where: { id: setId },
      data: { updated_at: new Date() }
    })
  }
}
