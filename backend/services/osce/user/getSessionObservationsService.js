import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class GetSessionObservationsService extends BaseService {
  static async call(userId, sessionId) {
    if (!userId) {
      throw new Error('User ID is required')
    }

    if (!sessionId) {
      throw new Error('Session ID is required')
    }

    // Verify session belongs to user
    const session = await prisma.osce_sessions.findFirst({
      where: {
        unique_id: sessionId,
        user_id: userId,
      },
      include: {
        osce_topic: {
          include: {
            osce_topic_observations: {
              where: {
                osce_observation: {
                  is_active: true,
                },
              },
              include: {
                osce_observation: {
                  include: {
                    group: true,
                  },
                },
              },
              orderBy: [
                { order: 'asc' },
              ],
            },
          },
        },
        osce_session_observations: {
          include: {
            osce_observation: {
              include: {
                group: true,
              },
            },
          },
        },
      },
    })

    if (!session) {
      throw new Error('Session not found or access denied')
    }

    // Get available observations from topic
    const availableObservations = session.osce_topic.osce_topic_observations.map(topicObs => ({
      id: topicObs.osce_observation.id,
      name: topicObs.osce_observation.name,
      groupId: topicObs.osce_observation.group_id,
      groupName: topicObs.osce_observation.group?.name || '',
      observationText: topicObs.observation_text,
      requiresInterpretation: topicObs.requires_interpretation,
      order: topicObs.order,
    }))

    // Get user's selected observations
    const selectedObservations = session.osce_session_observations.map(sessionObs => ({
      id: sessionObs.id,
      observationId: sessionObs.observation_id,
      name: sessionObs.osce_observation.name,
      groupName: sessionObs.osce_observation.group?.name || '',
      isChecked: sessionObs.is_checked,
      notes: sessionObs.notes,
    }))

    return {
      availableObservations,
      selectedObservations,
      observationsLocked: session.observations_locked,
    }
  }
}
