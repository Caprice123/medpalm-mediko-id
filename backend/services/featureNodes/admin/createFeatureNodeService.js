import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'

export class CreateFeatureNodeService extends BaseService {
  static async call({ name, slug, parentId, nodeType }) {
    if (!name?.trim()) throw new ValidationError('Nama wajib diisi')
    if (!slug?.trim()) throw new ValidationError('Slug wajib diisi')

    const existing = await prisma.feature_nodes.findUnique({ where: { slug } })
    if (existing) throw new ValidationError('Slug sudah digunakan')

    if (parentId) {
      const parent = await prisma.feature_nodes.findUnique({ where: { id: parseInt(parentId) } })
      if (!parent) throw new ValidationError('Node induk tidak ditemukan')
    }

    const node = await prisma.feature_nodes.create({
      data: {
        name: name.trim(),
        slug: slug.trim(),
        parent_id: parentId ? parseInt(parentId) : null,
        node_type: nodeType || null,
      },
      include: {
        _count: { select: { children: true } },
      },
    })

    return node
  }
}
