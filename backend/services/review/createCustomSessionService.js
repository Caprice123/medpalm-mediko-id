import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'

export class CreateCustomSessionService extends BaseService {
  static async call({ userId, name, recordType = 'flashcard_card', nodeId, departmentNodeId, mode, cardLimit }) {
    if (!name?.trim()) throw new ValidationError('Nama sesi wajib diisi')

    return prisma.user_review_custom_sessions.create({
      data: {
        user_id: userId,
        name: name.trim(),
        record_type: recordType,
        node_id: nodeId ? parseInt(nodeId) : null,
        department_node_id: departmentNodeId ? parseInt(departmentNodeId) : null,
        mode: mode || 'due_today',
        card_limit: parseInt(cardLimit) || 20,
      },
    })
  }
}
