import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { v4 as uuidv4 } from 'uuid'
import attachmentService from '#services/attachment/attachmentService'

export class StartOsceSessionService extends BaseService {
  static async call(userId, topicId) {
    if (!userId) {
      throw new Error('User ID is required')
    }

    if (!topicId) {
      throw new Error('Topic ID is required')
    }

    try {
      // Verify topic exists and is published
      const topic = await prisma.osce_topics.findFirst({
        where: {
          id: topicId,
          status: 'published',
          is_active: true,
        },
      })

      if (!topic) {
        throw new Error('Topic not found or not available')
      }

      // Fetch attachments with presigned URLs
      const attachments = await attachmentService.getAttachments('osce_topic', topicId)
      const attachmentsWithUrls = await Promise.all(
        attachments.map(async (attachment) => {
          const url = await attachmentService.getAttachmentWithUrl('osce_topic', topicId, attachment.name)
          return {
            blobId: attachment.blob_id,
            filename: attachment.blob?.filename || attachment.name,
            url: url?.url || null,
            contentType: attachment.blob?.content_type || 'application/octet-stream'
          }
        })
      )

      // Create new session with UUID
      const session = await prisma.osce_sessions.create({
        data: {
          unique_id: uuidv4(),
          user_id: userId,
          osce_topic_id: topicId,
          ai_model_used: topic.ai_model,
          duration_minutes: 0, // Will be updated when session completes
          credits_used: 0, // Will be updated based on usage
        },
        include: {
          osce_topic: {
            select: {
              id: true,
              title: true,
              description: true,
              scenario: true,
              guide: true,
              context: true,
              answer_key: true,
              knowledge_base: true,
              system_prompt: true,
              ai_model: true,
              duration_minutes: true,
            },
          },
        },
      })

      return {
        ...session,
        osce_topic: {
          ...session.osce_topic,
          attachments: attachmentsWithUrls
        }
      }
    } catch (error) {
      console.error('[StartOsceSessionService] Error:', error)
      if (error.message.includes('not found')) {
        throw error
      }
      throw new Error('Failed to start OSCE session')
    }
  }
}
