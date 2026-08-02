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

async function resolveLinkedItems(relations, linkedType, idField) {
  const ids = relations.map(r => r[idField])
  if (!ids.length) return []

  if (linkedType === 'anatomy_quiz') {
    const quizzes = await prisma.anatomy_quizzes.findMany({
      where: { id: { in: ids }, status: 'published', is_deleted: false },
      select: { id: true, unique_id: true, title: true, description: true, difficulty: true, question_count: true, estimated_minutes: true },
    })
    const map = Object.fromEntries(quizzes.map(q => [q.id, q]))
    return relations
      .filter(r => map[r[idField]])
      .map(r => {
        const q = map[r[idField]]
        return {
          id: r.id,
          relationType: r.relation_type ?? '',
          type: 'anatomy_quiz',
          uniqueId: q.unique_id,
          title: q.title,
          description: q.description,
          difficulty: q.difficulty || 'medium',
          questionCount: q.question_count,
          estimatedMinutes: q.estimated_minutes || null,
        }
      })
  }

  if (linkedType === 'atlas_model') {
    const models = await prisma.atlas_models.findMany({
      where: { id: { in: ids }, status: 'published', is_deleted: false },
      select: { id: true, unique_id: true, title: true, description: true },
    })
    const map = Object.fromEntries(models.map(m => [m.id, m]))
    return relations
      .filter(r => map[r[idField]])
      .map(r => {
        const m = map[r[idField]]
        return {
          id: r.id,
          relationType: r.relation_type ?? '',
          type: 'atlas_model',
          uniqueId: m.unique_id,
          title: m.title,
          description: m.description,
        }
      })
  }

  return []
}

class UserContentRelationsController {
  async listRelations(req, res) {
    const { sourceType, sourceUniqueId, targetType, targetUniqueId, relationType } = req.query

    if (sourceUniqueId) {
      const sourceId = await resolveId(sourceType, sourceUniqueId)
      if (!sourceId) return res.status(404).json({ message: 'Sumber tidak ditemukan' })

      const where = { source_type: sourceType, source_id: sourceId }
      if (targetType) where.target_type = targetType
      if (relationType) where.relation_type = relationType

      const relations = await prisma.content_relations.findMany({ where, orderBy: { id: 'asc' } })
      const resolved = await resolveLinkedItems(relations, targetType, 'target_id')
      return res.status(200).json({ data: resolved })
    }

    if (targetUniqueId) {
      const targetId = await resolveId(targetType, targetUniqueId)
      if (!targetId) return res.status(404).json({ message: 'Target tidak ditemukan' })

      const where = { target_type: targetType, target_id: targetId }
      if (sourceType) where.source_type = sourceType
      if (relationType) where.relation_type = relationType

      const relations = await prisma.content_relations.findMany({ where, orderBy: { id: 'asc' } })
      const resolvedSourceType = sourceType || 'atlas_model'
      const resolved = await resolveLinkedItems(relations, resolvedSourceType, 'source_id')
      return res.status(200).json({ data: resolved })
    }

    return res.status(400).json({ message: 'Parameter sourceUniqueId atau targetUniqueId diperlukan' })
  }
}

export default new UserContentRelationsController()
