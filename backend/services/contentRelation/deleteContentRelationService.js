import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class DeleteContentRelationService extends BaseService {
  static async call({ id }) {
    const existing = await prisma.content_relations.findUnique({ where: { id: Number(id) } })
    if (!existing) throw new ValidationError('Relasi tidak ditemukan')
    await prisma.content_relations.delete({ where: { id: Number(id) } })
  }
}
