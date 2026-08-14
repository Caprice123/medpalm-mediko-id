import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class UpdateContentRelationService extends BaseService {
  static async call({ id, label }) {
    const existing = await prisma.content_relations.findUnique({ where: { id: Number(id) } })
    if (!existing) throw new ValidationError('Relasi tidak ditemukan')
    return prisma.content_relations.update({
      where: { id: Number(id) },
      data: { label: label?.trim() || null },
    })
  }
}
