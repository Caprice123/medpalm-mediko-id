import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import { resolveFeatureNodeSlug } from '#utils/featureNodeSlugResolver'

const VISIBILITY = 'diagnostic'

export class CreateDiagnosticNodeService extends BaseService {
  static async call({ name, slug, parentId, layer, classification }) {
    if (!name?.trim()) throw new ValidationError('Nama wajib diisi')
    if (!slug?.trim()) throw new ValidationError('Slug wajib diisi')
    if (layer === undefined || layer === null) throw new ValidationError('Layer wajib diisi')

    const finalSlug = await resolveFeatureNodeSlug({ slug, visibility: VISIBILITY, layer })

    if (parentId) {
      const parent = await prisma.feature_nodes.findUnique({ where: { id: parseInt(parentId) } })
      if (!parent) throw new ValidationError('Node induk tidak ditemukan')
    }

    return prisma.feature_nodes.create({
      data: {
        name: name.trim(),
        slug: finalSlug,
        parent_id: parentId ? parseInt(parentId) : null,
        layer: parseInt(layer),
        visibility: VISIBILITY,
        ...(classification && { classification }),
      },
      include: { _count: { select: { children: true } } },
    })
  }
}
