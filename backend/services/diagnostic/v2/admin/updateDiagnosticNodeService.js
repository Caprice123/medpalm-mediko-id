import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import { resolveFeatureNodeSlug } from '#utils/featureNodeSlugResolver'

export class UpdateDiagnosticNodeService extends BaseService {
  static async call({ id, name, slug, classification }) {
    if (!name?.trim()) throw new ValidationError('Nama wajib diisi')
    if (!slug?.trim()) throw new ValidationError('Slug wajib diisi')

    const node = await prisma.feature_nodes.findUnique({ where: { id: parseInt(id) } })
    if (!node) throw new ValidationError('Node tidak ditemukan')

    const finalSlug = slug.trim() === node.slug
      ? node.slug
      : await resolveFeatureNodeSlug({ slug, visibility: node.visibility, layer: node.layer, excludeId: parseInt(id) })

    return prisma.feature_nodes.update({
      where: { id: parseInt(id) },
      data: {
        name: name.trim(),
        slug: finalSlug,
        updated_at: new Date(),
        ...(classification !== undefined && { classification }),
      },
    })
  }
}
