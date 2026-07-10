import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'

export class UpdateFeatureNodeService extends BaseService {
  static async call({ id, name, slug, parentId, nodeType }) {
    const node = await prisma.feature_nodes.findUnique({ where: { id: parseInt(id) } })
    if (!node) throw new ValidationError('Node tidak ditemukan')

    if (!name?.trim()) throw new ValidationError('Nama wajib diisi')
    if (!slug?.trim()) throw new ValidationError('Slug wajib diisi')

    if (slug !== node.slug) {
      const existing = await prisma.feature_nodes.findUnique({ where: { slug } })
      if (existing) throw new ValidationError('Slug sudah digunakan')
    }

    if (parentId) {
      const parsedParentId = parseInt(parentId)
      if (parsedParentId === parseInt(id)) throw new ValidationError('Node tidak bisa menjadi induk dari dirinya sendiri')
      const parent = await prisma.feature_nodes.findUnique({ where: { id: parsedParentId } })
      if (!parent) throw new ValidationError('Node induk tidak ditemukan')
    }

    const updated = await prisma.feature_nodes.update({
      where: { id: parseInt(id) },
      data: {
        name: name.trim(),
        slug: slug.trim(),
        parent_id: parentId ? parseInt(parentId) : null,
        node_type: nodeType || null,
        updated_at: new Date(),
      },
      include: {
        _count: { select: { children: true } },
      },
    })

    return updated
  }
}
