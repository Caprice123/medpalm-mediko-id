import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'

export class DeleteCustomSessionService extends BaseService {
  static async call({ userId, sessionId }) {
    const session = await prisma.user_review_custom_sessions.findFirst({
      where: { id: parseInt(sessionId), user_id: userId },
    })
    if (!session) throw new ValidationError('Sesi tidak ditemukan')
    await prisma.user_review_custom_sessions.delete({ where: { id: session.id } })
  }
}
