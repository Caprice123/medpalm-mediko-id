import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'

export class UpdateDiagnosticNodeService extends BaseService {
  static async call({ id, name, slug, classification }) {
    if (!name?.trim()) throw new ValidationError('Nama wajib diisi')
    if (!slug?.trim()) throw new ValidationError('Slug wajib diisi')

    const node = await prisma.feature_nodes.findUnique({ where: { id: parseInt(id) } })
    if (!node) throw new ValidationError('Node tidak ditemukan')

    const duplicate = await prisma.feature_nodes.findFirst({
      where: { slug: slug.trim(), id: { not: parseInt(id) } },
    })
    if (duplicate) throw new ValidationError('Slug sudah digunakan')

    return prisma.feature_nodes.update({
      where: { id: parseInt(id) },
      data: {
        name: name.trim(),
        slug: slug.trim(),
        updated_at: new Date(),
        ...(classification !== undefined && { classification }),
      },
    })
  }
}
