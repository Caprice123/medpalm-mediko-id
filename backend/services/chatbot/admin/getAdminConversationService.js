import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'

export class GetAdminConversationService extends BaseService {
  static async call({ conversationId }) {
    this.validate({ conversationId })

    const conversation = await prisma.chatbot_conversations.findFirst({
      where: {
        id: conversationId,
        is_deleted: false
      },
      include: {
        chatbot_messages: {
          where: { is_deleted: false },
          include: {
            chatbot_message_sources: {
              orderBy: { score: 'desc' }
            },
            chatbot_message_feedbacks: true
          },
          orderBy: { created_at: 'asc' }
        },
        _count: {
          select: {
            chatbot_messages: {
              where: { is_deleted: false }
            }
          }
        }
      }
    })

    if (!conversation) {
      throw new ValidationError('Conversation not found')
    }

    const transformedMessages = conversation.chatbot_messages.map(msg => ({
      id: msg.id,
      senderType: msg.sender_type,
      modeType: msg.mode_type,
      content: msg.content,
      creditsUsed: msg.credits_used,
      sources: msg.chatbot_message_sources.map(src => ({
        id: src.id,
        sourceType: src.source_type,
        title: src.title,
        content: src.content,
        url: src.url,
        score: src.score
      })),
      feedbacks: msg.chatbot_message_feedbacks.map(fb => ({
        userId: fb.user_id,
        isHelpful: fb.is_helpful,
        feedback: fb.feedback,
        createdAt: fb.created_at
      })),
      createdAt: msg.created_at
    }))

    return {
      id: conversation.id,
      userId: conversation.user_id,
      topic: conversation.topic,
      messageCount: conversation._count.chatbot_messages,
      messages: transformedMessages,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt
    }
  }

  static validate({ conversationId }) {
    if (!conversationId || isNaN(parseInt(conversationId))) {
      throw new ValidationError('Invalid conversation ID')
    }
  }
}
