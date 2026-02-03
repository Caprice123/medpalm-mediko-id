import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import attachmentService from '#services/attachment/attachmentService'
import idriveService from '#services/idrive.service'
import { ValidationError } from '#errors/validationError'

export class SaveSessionObservationsService extends BaseService {
  static async call(userId, sessionId, data) {
    if (!userId) {
      throw new ValidationError('User ID is required')
    }

    if (!sessionId) {
      throw new ValidationError('Session ID is required')
    }

    // Verify session belongs to user
    const session = await prisma.osce_sessions.findFirst({
      where: {
        unique_id: sessionId,
        user_id: userId,
      },
    })

    if (!session) {
      throw new ValidationError('Session not found or access denied')
    }

    const isLocked = session.observations_locked

    // Handle selection (first save)
    if (data.snapshotIds && Array.isArray(data.snapshotIds)) {
      if (isLocked) {
        throw new ValidationError('Observations selection is locked and cannot be changed')
      }
      // Mark selected observations as checked
      await Promise.all(
        data.snapshotIds.map(async (snapshotId) => {
            await prisma.osce_session_observations.create({
                data: { 
                    observation_snapshot_id: snapshotId,
                    osce_session_id: session.id,
                    interpretation: null,
                 },
            })
        })
      )

      // Lock observations
      await prisma.osce_sessions.update({
        where: { id: session.id },
        data: { observations_locked: true },
      })
    }

    // Fetch and return saved observations with full details
    const savedObservations = await prisma.osce_session_observations.findMany({
      where: {
        osce_session_id: session.id,
      },
      include: {
        observation_snapshot: true,
      },
    })

    // Add attachments for each observation
    const observationsWithAttachments = await Promise.all(
      savedObservations.map(async (obs) => {
        const attachments = await attachmentService.getAttachments(
          'osce_session_observation_snapshot',
          obs.observation_snapshot_id
        )

        return {
          id: obs.id,
          snapshotId: obs.observation_snapshot_id,
          observationId: obs.observation_snapshot.observation_id,
          name: obs.observation_snapshot.observation_name,
          observationText: obs.observation_snapshot.observation_text,
          requiresInterpretation: obs.observation_snapshot.requires_interpretation,
          interpretation: obs.interpretation,
          attachments: attachments.length > 0 ? {
            id: attachments[0].id,
            name: attachments[0].name,
            url: attachments[0].blob?.key ? await idriveService.getSignedUrl(attachments[0].blob.key) : null,
            contentType: attachments[0].blob?.content_type || null,
          } : null,
        }
      })
    )
    console.log(observationsWithAttachments[0])

    return observationsWithAttachments
  }
}
