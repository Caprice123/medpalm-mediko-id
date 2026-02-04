import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'

export class UpdateSessionMetadataService extends BaseService {
  static async call(userId, sessionId, { sttProvider }) {
    if (!userId) {
      throw new ValidationError('User ID is required')
    }

    if (!sessionId) {
      throw new ValidationError('Session ID is required')
    }

    // Find the session
    const session = await prisma.osce_sessions.findFirst({
      where: {
        unique_id: sessionId,
        user_id: userId,
      },
    })

    if (!session) {
      throw new ValidationError('Session not found or access denied')
    }

    // Get existing metadata or initialize as empty object
    const existingMetadata = session.metadata || {}

    // Update metadata with new STT provider
    const updatedMetadata = {
      ...existingMetadata,
    }

    // Only update sttProvider if provided
    if (sttProvider) {
      updatedMetadata.stt_provider = sttProvider
    }

    // Update session metadata
    await prisma.osce_sessions.update({
      where: { id: session.id },
      data: {
        metadata: updatedMetadata,
      },
    })

    return { success: true }
  }
}
