import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'

export class SaveDiagnosesService extends BaseService {
  static async call(userId, sessionId, diagnosisData) {
    if (!userId) {
      throw new ValidationError('User ID is required')
    }

    if (!sessionId) {
      throw new ValidationError('Session ID is required')
    }

    if (!diagnosisData) {
      throw new ValidationError('Diagnosis data is required')
    }

    try {
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

      // Delete existing diagnoses for this session
      await prisma.osce_session_diagnoses.deleteMany({
        where: {
          osce_session_id: session.id,
        },
      })

      // Prepare diagnoses to save
      const diagnosesToCreate = []

      // Add main diagnosis (utama)
      if (diagnosisData.utama && diagnosisData.utama.trim()) {
        diagnosesToCreate.push({
          osce_session_id: session.id,
          type: 'utama',
          diagnosis: diagnosisData.utama.trim(),
        })
      }

      // Add differential diagnoses (pembanding)
      if (diagnosisData.pembanding && Array.isArray(diagnosisData.pembanding)) {
        diagnosisData.pembanding.forEach(diagnosis => {
          if (diagnosis && diagnosis.trim()) {
            diagnosesToCreate.push({
              osce_session_id: session.id,
              type: 'pembanding',
              diagnosis: diagnosis.trim(),
            })
          }
        })
      }

      // Save all diagnoses
      if (diagnosesToCreate.length > 0) {
        await prisma.osce_session_diagnoses.createMany({
          data: diagnosesToCreate,
        })
      }

      // Fetch and return saved diagnoses
      const savedDiagnoses = await prisma.osce_session_diagnoses.findMany({
        where: {
          osce_session_id: session.id,
        },
        orderBy: [
          { type: 'desc' }, // 'utama' comes before 'pembanding'
          { created_at: 'asc' },
        ],
      })

      return savedDiagnoses
    } catch (error) {
      console.error('[SaveDiagnosesService] Error:', error)
      throw error
    }
  }
}
