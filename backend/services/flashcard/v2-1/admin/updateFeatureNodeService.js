import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import attachmentService from '#services/attachment/attachmentService'

export class UpdateFeatureNodeService extends BaseService {
  static async call({ id, name, slug, parentId, nodeType, visibility, classification, layer, icon, description, videoBlobId, videoExplanation }) {
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
        ...(visibility !== undefined && { visibility }),
        classification: classification !== undefined ? (classification || null) : undefined,
        ...(layer !== undefined && { layer: layer ? parseInt(layer) : null }),
        ...(icon !== undefined && { icon: icon || null }),
        ...(description !== undefined && { description: description || null }),
        ...(videoExplanation !== undefined && { video_explanation: videoExplanation || null }),
        updated_at: new Date(),
      },
      include: {
        _count: { select: { children: true } },
      },
    })

    if (videoBlobId) {
      await attachmentService.detachAll({ recordType: 'feature_node', recordId: updated.id }, true)
      await attachmentService.attach({
        blobId: parseInt(videoBlobId),
        recordType: 'feature_node',
        recordId: updated.id,
        name: 'video',
      })
    }

    if (name && name.trim() !== node.name) {
      const linkedNoteRecord = await prisma.feature_node_records.findFirst({
        where: { node_id: updated.id, record_type: 'summary_note' },
      })
      if (linkedNoteRecord) {
        await prisma.summary_notes.update({
          where: { id: linkedNoteRecord.record_id },
          data: { title: updated.name },
        })
      }
    }

    return updated
  }
}
