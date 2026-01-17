import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class SaveSessionObservationsService extends BaseService {
  static async call(userId, sessionId, observations) {
    if (!userId) {
      throw new Error('User ID is required')
    }

    if (!sessionId) {
      throw new Error('Session ID is required')
    }

    if (!observations || !Array.isArray(observations)) {
      throw new Error('Observations must be an array')
    }

    if (observations.length > 5) {
      throw new Error('Maximum 5 observations allowed')
    }

    // Verify session belongs to user and not locked
    const session = await prisma.osce_sessions.findFirst({
      where: {
        unique_id: sessionId,
        user_id: userId,
      },
    })

    if (!session) {
      throw new Error('Session not found or access denied')
    }

    if (session.observations_locked) {
      throw new Error('Observations have already been saved and cannot be modified')
    }

    // Delete existing observations
    await prisma.osce_session_observations.deleteMany({
      where: {
        osce_session_id: session.id,
      },
    })

    // Save new observations
    const observationsToCreate = observations.map(obs => ({
      osce_session_id: session.id,
      observation_id: obs.observationId,
      is_checked: true, // Marked as selected
      notes: obs.interpretation || null,
    }))

    if (observationsToCreate.length > 0) {
      await prisma.osce_session_observations.createMany({
        data: observationsToCreate,
      })
    }

    // Lock observations (prevent further changes)
    await prisma.osce_sessions.update({
      where: { id: session.id },
      data: {
        observations_locked: true,
      },
    })

    // Fetch and return saved observations
    const savedObservations = await prisma.osce_session_observations.findMany({
      where: {
        osce_session_id: session.id,
      },
      include: {
        osce_observation: {
          include: {
            group: true,
          },
        },
      },
    })

    return savedObservations
  }
}
