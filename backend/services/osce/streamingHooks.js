/**
 * OSCE Practice Streaming Hooks
 *
 * Feature-specific handlers for OSCE streaming:
 * - Message saving to osce_session_messages table
 * - Session updates
 * - Citation handling for Perplexity
 */

import prisma from '#prisma/client'
import { StreamingHandler } from '#utils/aiUtils/streamingHandler'

/**
 * Hooks for Gemini streaming
 */
export class OsceGeminiHooks {
  /**
   * Before streaming: Create message records
   */
  static async beforeStreaming({ sessionId, userMessageContent }) {
    // CREATE MESSAGE RECORDS FIRST (before streaming)
    const userMessage = await prisma.osce_session_messages.create({
      data: {
        osce_session_id: sessionId,
        sender_type: 'user',
        content: userMessageContent,
        credits_used: 0
      }
    })

    const aiMessage = await prisma.osce_session_messages.create({
      data: {
        osce_session_id: sessionId,
        sender_type: 'ai',
        content: '', // Empty initially
        credits_used: 0 // Will be set later
      }
    })

    return {
      userMessage: {
        id: userMessage.id,
        senderType: 'user',
        content: userMessage.content,
        createdAt: userMessage.created_at.toISOString()
      },
      aiMessage: {
        id: aiMessage.id,
        senderType: 'ai',
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
   * After streaming: Update message content and session
   */
  static async afterStreaming({
    messageRecords,
    sessionId,
    contentToSave,
    messageCost
  }) {
    // Save the AI message content
    await prisma.osce_session_messages.update({
      where: { id: messageRecords._raw.aiMessage.id },
      data: {
        content: contentToSave,
        credits_used: messageCost
      }
    })

    // Update session's total credits used
    await prisma.osce_sessions.update({
      where: { id: sessionId },
      data: {
        credits_used: { increment: messageCost }
      }
    })

    console.log('✅ Saved AI message to database')
  }
}

/**
 * Hooks for Perplexity streaming
 * NOTE: OSCE does not save citations - only content
 */
export class OscePerplexityHooks {
  /**
   * Before streaming: Create message records
   */
  static async beforeStreaming({ sessionId, userMessageContent }) {
    // CREATE MESSAGE RECORDS FIRST (before streaming)
    const userMessage = await prisma.osce_session_messages.create({
      data: {
        osce_session_id: sessionId,
        sender_type: 'user',
        content: userMessageContent,
        credits_used: 0
      }
    })

    const aiMessage = await prisma.osce_session_messages.create({
      data: {
        osce_session_id: sessionId,
        sender_type: 'ai',
        content: '', // Empty initially
        credits_used: 0 // Will be set later
      }
    })

    return {
      userMessage: {
        id: userMessage.id,
        senderType: 'user',
        content: userMessage.content,
        createdAt: userMessage.created_at.toISOString()
      },
      aiMessage: {
        id: aiMessage.id,
        senderType: 'ai',
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
   * After streaming: Save message content and update session
   * NOTE: OSCE does not save citations
   */
  static async afterStreaming({
    messageRecords,
    sessionId,
    contentToSave,
    messageCost
  }) {
    // Save the AI message content
    await prisma.osce_session_messages.update({
      where: { id: messageRecords._raw.aiMessage.id },
      data: {
        content: contentToSave,
        credits_used: messageCost
      }
    })

    // Update session's total credits used
    await prisma.osce_sessions.update({
      where: { id: sessionId },
      data: {
        credits_used: { increment: messageCost }
      }
    })

    console.log('✅ Saved AI message to database')
  }
}
