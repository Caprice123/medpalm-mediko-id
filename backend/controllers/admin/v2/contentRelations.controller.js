import { ListContentRelationsService } from '#services/contentRelation/listContentRelationsService'
import prisma from '#prisma/client'

async function resolveId(type, uniqueId) {
  if (type === 'atlas_model') {
    const r = await prisma.atlas_models.findFirst({ where: { unique_id: uniqueId }, select: { id: true } })
    return r?.id ?? null
  }
  if (type === 'anatomy_quiz') {
    const r = await prisma.anatomy_quizzes.findFirst({ where: { unique_id: uniqueId }, select: { id: true } })
    return r?.id ?? null
  }
  if (type === 'summary_note') {
    const r = await prisma.summary_notes.findFirst({ where: { unique_id: uniqueId }, select: { id: true } })
    return r?.id ?? null
  }
  if (type === 'feature_node') {
    const r = await prisma.feature_nodes.findFirst({ where: { slug: uniqueId }, select: { id: true } })
    return r?.id ?? null
  }
  return null
}

class ContentRelationsController {
  async listRelations(req, res) {
    const { sourceType, sourceUniqueId, targetType } = req.query
    const sourceId = await resolveId(sourceType, sourceUniqueId)
    if (!sourceId) return res.status(404).json({ message: 'Sumber tidak ditemukan' })
    const relations = await ListContentRelationsService.call({ sourceType, sourceId, targetType: targetType || null })
    return res.status(200).json({ data: relations })
  }

  async createRelation(req, res) {
    const { sourceType, sourceUniqueId, targetType, targetUniqueId, relationType = '' } = req.body
    const [sourceId, targetId] = await Promise.all([
      resolveId(sourceType, sourceUniqueId),
      resolveId(targetType, targetUniqueId),
    ])
    if (!sourceId) return res.status(404).json({ message: 'Sumber tidak ditemukan' })
    if (!targetId) return res.status(404).json({ message: 'Target tidak ditemukan' })

    if (sourceType === targetType && (relationType === 'prev' || relationType === 'next')) {
      const reverseType = relationType === 'prev' ? 'next' : 'prev'
      await prisma.$transaction(async (tx) => {
        const existingSource = await tx.content_relations.findFirst({
          where: { source_type: sourceType, source_id: sourceId, target_type: targetType, relation_type: relationType },
        })
        if (existingSource) {
          await tx.content_relations.deleteMany({
            where: { source_type: targetType, source_id: existingSource.target_id, target_type: sourceType, target_id: sourceId, relation_type: reverseType },
          })
          await tx.content_relations.delete({ where: { id: existingSource.id } })
        }

        const existingTarget = await tx.content_relations.findFirst({
          where: { source_type: targetType, source_id: targetId, target_type: sourceType, relation_type: reverseType },
        })
        if (existingTarget) {
          await tx.content_relations.deleteMany({
            where: { source_type: sourceType, source_id: existingTarget.target_id, target_type: targetType, target_id: targetId, relation_type: relationType },
          })
          await tx.content_relations.delete({ where: { id: existingTarget.id } })
        }

        await tx.content_relations.create({
          data: { source_type: sourceType, source_id: sourceId, target_type: targetType, target_id: targetId, relation_type: relationType },
        })
        await tx.content_relations.create({
          data: { source_type: targetType, source_id: targetId, target_type: sourceType, target_id: sourceId, relation_type: reverseType },
        })
      })
    } else {
      const existing = await prisma.content_relations.findFirst({
        where: { source_type: sourceType, source_id: sourceId, target_type: targetType, target_id: targetId, relation_type: relationType },
      })
      if (existing) return res.status(409).json({ message: 'Relasi sudah ada' })
      await prisma.content_relations.create({
        data: { source_type: sourceType, source_id: sourceId, target_type: targetType, target_id: targetId, relation_type: relationType },
      })
    }

    return res.status(201).json({ data: { success: true } })
  }

  async deleteRelation(req, res) {
    const { id } = req.params
    const relation = await prisma.content_relations.findUnique({ where: { id: Number(id) } })
    if (!relation) return res.status(404).json({ message: 'Relasi tidak ditemukan' })

    const isSameType = relation.source_type === relation.target_type
    const reverseType = relation.relation_type === 'prev' ? 'next' : relation.relation_type === 'next' ? 'prev' : null

    await prisma.$transaction(async (tx) => {
      if (isSameType && reverseType !== null) {
        await tx.content_relations.deleteMany({
          where: { source_type: relation.target_type, source_id: relation.target_id, target_type: relation.source_type, target_id: relation.source_id, relation_type: reverseType },
        })
      }
      await tx.content_relations.delete({ where: { id: Number(id) } })
    })

    return res.status(200).json({ message: 'Relasi berhasil dihapus' })
  }
}

export default new ContentRelationsController()
