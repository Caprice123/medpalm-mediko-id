import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import attachmentService from '#services/attachment/attachmentService'
import { resolveFeatureNodeSlug } from '#utils/featureNodeSlugResolver'

export class CreateFeatureNodeService extends BaseService {
  static async call({ name, slug, parentId, nodeType, visibility = 'general', classification, layer, icon, description, videoBlobId, videoExplanation }) {
    if (!name?.trim()) throw new ValidationError('Nama wajib diisi')
    if (!slug?.trim()) throw new ValidationError('Slug wajib diisi')

    const finalSlug = await resolveFeatureNodeSlug({ slug, nodeType, visibility, layer })

    let order = null
    if (parentId) {
      const parent = await prisma.feature_nodes.findUnique({ where: { id: parseInt(parentId) } })
      if (!parent) throw new ValidationError('Node induk tidak ditemukan')
      const { _max } = await prisma.feature_nodes.aggregate({
        where: { parent_id: parseInt(parentId) },
        _max: { order: true },
      })
      order = (_max.order ?? -1) + 1
    }

    const parsedLayer = layer ? parseInt(layer) : null

    const node = await prisma.feature_nodes.create({
      data: {
        name: name.trim(),
        slug: finalSlug,
        parent_id: parentId ? parseInt(parentId) : null,
        node_type: nodeType || null,
        visibility,
        classification: classification || null,
        layer: parsedLayer,
        order,
        icon: icon || null,
        description: description || null,
        video_explanation: videoExplanation || null,
      },
      include: {
        _count: { select: { children: true } },
      },
    })

    if (videoBlobId) {
      await attachmentService.attach({
        blobId: parseInt(videoBlobId),
        recordType: 'feature_node',
        recordId: node.id,
        name: 'video',
      })
    }

    return node
  }
}
