import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'

export class SubmitMcqSessionService extends BaseService {
  static async call({ userId, nodeResults }) {
    if (!nodeResults || nodeResults.length === 0) {
      throw new ValidationError('Hasil sesi tidak boleh kosong')
    }

    await Promise.all(nodeResults.map(({ nodeId, score }) =>
      prisma.user_node_progress.upsert({
        where: {
          user_id_node_id_feature_type: {
            user_id: userId,
            node_id: parseInt(nodeId),
            feature_type: 'mcq',
          },
        },
        create: {
          user_id: userId,
          node_id: parseInt(nodeId),
          feature_type: 'mcq',
          total_sessions: 1,
          total_score: Math.round(score),
        },
        update: {
          total_sessions: { increment: 1 },
          total_score: { increment: Math.round(score) },
        },
      })
    ))

    return { success: true }
  }
}
