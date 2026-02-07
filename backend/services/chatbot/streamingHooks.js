/**
 * Chatbot Streaming Hooks
 *
 * Feature-specific handlers for chatbot streaming:
 * - Message saving to chatbot_messages table
 * - Source/citation handling
 * - Conversation updates
 */

import prisma from '#prisma/client'
import { StreamingHandler } from '#utils/aiUtils/streamingHandler'

/**
 * Hooks for Gemini streaming (Normal and Validated modes)
 */
export class ChatbotGeminiHooks {
  /**
   * Before streaming: Create message records
   */
  static async beforeStreaming({
    conversationId,
    userMessageContent,
    mode,
    creditsUsed,
    sources
  }) {
    // CREATE MESSAGE RECORDS FIRST (before streaming)
    const userMessage = await prisma.chatbot_messages.create({
      data: {
        conversation_id: conversationId,
        sender_type: 'user',
        mode_type: null,
        content: userMessageContent,
        status: "completed",
        credits_used: 0,
        created_at: new Date()
      }
    })

    // Update conversation's last_message (trimmed to 50 chars)
    await prisma.chatbot_conversations.update({
      where: { id: conversationId },
      data: {
        last_message: userMessageContent.substring(0, 50),
        updated_at: new Date()
      }
    })

    const aiMessage = await prisma.chatbot_messages.create({
      data: {
        conversation_id: conversationId,
        sender_type: 'ai',
        mode_type: mode,
        content: '', // Empty initially, will be updated
        status: "streaming",
        credits_used: creditsUsed,
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
        modeType: aiMessage.mode_type,
        content: aiMessage.content,
        sources: sources,
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
    // SEND MESSAGE IDs to frontend (quota will be sent with first chunk)
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
      console.log('⚠️ Could not send started event (connection not ready yet, will retry with chunks)')
    }
  }

  /**
   * After streaming: Save sources, update conversation
   */
  static async afterStreaming({
    messageRecords,
    conversationId,
    sources
  }) {
    // DON'T save to database yet - let frontend finalize
    // Message stays in 'streaming' status until frontend calls /finalize
    console.log('⏸️  Not saving to DB - waiting for frontend to finalize')

    // Save sources if any (for Validated mode)
    // Filter to only include sources that are actually cited in the response
    if (sources && sources.length > 0) {
      const aiMessage = await prisma.chatbot_messages.findFirst({
        where: { id: messageRecords.aiMessage.id }
      })

      const filteredSources = StreamingHandler.filterUsedSources(aiMessage.content, sources)

      if (filteredSources.length > 0) {
        await prisma.chatbot_message_sources.createMany({
          data: filteredSources.map(src => ({
            message_id: messageRecords.aiMessage.id,
            source_type: src.sourceType,
            title: src.title,
            content: src.content,
            url: src.url,
            score: src.score
          }))
        })
      }

      // Update sources for response data
      messageRecords.aiMessage.sources = filteredSources
    }

    // Update conversation timestamp
    await prisma.chatbot_conversations.update({
      where: { id: conversationId },
      data: { updated_at: new Date() }
    })
  }
}

/**
 * Hooks for Perplexity streaming (Research mode)
 */
export class ChatbotPerplexityHooks {
  /**
   * Before streaming: Create message records
   */
  static async beforeStreaming({
    conversationId,
    userMessageContent,
    mode,
    creditsUsed,
    sources
  }) {
    // CREATE MESSAGE RECORDS FIRST (before streaming)
    const userMessage = await prisma.chatbot_messages.create({
      data: {
        conversation_id: conversationId,
        sender_type: 'user',
        mode_type: null,
        content: userMessageContent,
        status: "completed",
        credits_used: 0,
        created_at: new Date()
      }
    })

    // Update conversation's last_message (trimmed to 50 chars)
    await prisma.chatbot_conversations.update({
      where: { id: conversationId },
      data: {
        last_message: userMessageContent.substring(0, 50),
        updated_at: new Date()
      }
    })

    const aiMessage = await prisma.chatbot_messages.create({
      data: {
        conversation_id: conversationId,
        sender_type: 'ai',
        mode_type: mode,
        content: '', // Empty initially, will be updated
        status: "streaming",
        credits_used: creditsUsed,
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
        modeType: aiMessage.mode_type,
        content: aiMessage.content,
        sources: sources || [],
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
    // SEND MESSAGE IDs to frontend (quota already sent with deduction)
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
      console.log('⚠️ Could not send started event (connection not ready yet, will retry with chunks)')
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
   * After streaming: Save citations, update conversation
   */
  static async afterStreaming({
    messageRecords,
    conversationId,
    citations
  }) {
    // DON'T save to database yet - let frontend finalize
    // Message stays in 'streaming' status until frontend calls /finalize
    console.log('⏸️  Not saving to DB - waiting for frontend to finalize')

    // Save sources/citations if any
    const sources = []
    if (citations && citations.length > 0) {
      // Remove duplicates based on URL
      const uniqueCitations = Array.from(
        new Map(citations.map(c => [c.url, c])).values()
      )

      await prisma.chatbot_message_sources.createMany({
        data: uniqueCitations.slice(0, 10).map((citation, index) => ({
          message_id: messageRecords.aiMessage.id,
          source_type: 'web_search',
          title: citation.title || citation.url.substring(0, 200),
          content: citation.date || citation.url.substring(0, 500),
          url: citation.url,
          score: 1.0 - (index * 0.1)
        }))
      })

      // Format sources for response
      sources.push(...uniqueCitations.slice(0, 10).map((citation, index) => ({
        sourceType: 'web_search',
        title: citation.title || citation.url.substring(0, 200),
        content: citation.date || citation.url.substring(0, 500),
        url: citation.url,
        score: 1.0 - (index * 0.1)
      })))

      // Update sources for response data
      messageRecords.aiMessage.sources = sources
    }

    // Update conversation timestamp
    await prisma.chatbot_conversations.update({
      where: { id: conversationId },
      data: { updated_at: new Date() }
    })
  }
}
