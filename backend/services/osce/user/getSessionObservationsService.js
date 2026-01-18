import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import attachmentService from '#services/attachment/attachmentService'

export class GetSessionObservationsService extends BaseService {
  static async call(userId, sessionId) {
    if (!userId) {
      throw new Error('User ID is required')
    }

    if (!sessionId) {
      throw new Error('Session ID is required')
    }

    // Verify session belongs to user and get observation snapshots
    const session = await prisma.osce_sessions.findFirst({
      where: {
        unique_id: sessionId,
        user_id: userId,
      },
      include: {
        osce_session_observation_group_snapshots: {
          include: {
            osce_session_observation_snapshots: {
              include: {
                session_observations: true,
              },
              orderBy: {
                id: 'asc',
              },
            },
          },
          orderBy: {
            id: 'asc',
          },
        },
      },
    })

    if (!session) {
      throw new Error('Session not found or access denied')
    }

    // Transform snapshot data into structured groups with attachments
    const observationGroups = await Promise.all(
      session.osce_session_observation_group_snapshots.map(async (groupSnapshot) => {
        const observations = await Promise.all(
          groupSnapshot.osce_session_observation_snapshots.map(async (obsSnapshot) => {
            const userInteraction = obsSnapshot.session_observations[0] || {}

            // Get attachments for this observation snapshot
            const attachments = await attachmentService.getAttachments(
              'osce_session_observation_snapshot',
              obsSnapshot.id
            )

            return {
              snapshotId: obsSnapshot.id,
              observationId: obsSnapshot.observation_id,
              name: obsSnapshot.observation_name,
              observationText: obsSnapshot.observation_text,
              requiresInterpretation: obsSnapshot.requires_interpretation,
              isChecked: userInteraction.is_checked || false,
              notes: userInteraction.notes || null,
              interactionId: userInteraction.id || null,
              attachments: attachments.map(att => ({
                id: att.id,
                name: att.name,
                url: att.blob?.url || null,
                contentType: att.blob?.content_type || null,
              })),
            }
          })
        )

        return {
          groupId: groupSnapshot.group_id,
          groupName: groupSnapshot.group_name,
          observations,
        }
      })
    )

    return {
      observationGroups,
      observationsLocked: session.observations_locked,
    }
  }
}
