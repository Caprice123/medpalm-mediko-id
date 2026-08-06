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

const ORDER_RECORD_TYPE = { atlas_model: '3d_atlas', anatomy_quiz: 'anatomy_quiz' }
const ORDER_MODEL_NAME = { atlas_model: 'atlas_models', anatomy_quiz: 'anatomy_quizzes' }
const ORDER_SELECT = {
  atlas_model: { id: true, unique_id: true, title: true, description: true },
  anatomy_quiz: { id: true, unique_id: true, title: true, description: true, difficulty: true, question_count: true, estimated_minutes: true },
}

function serializeOrderItem(type, recordId, item) {
  if (type === 'atlas_model') {
    return { id: recordId, type, uniqueId: item.unique_id, title: item.title, description: item.description }
  }
  return {
    id: recordId, type, uniqueId: item.unique_id, title: item.title, description: item.description,
    difficulty: item.difficulty || 'medium', questionCount: item.question_count, estimatedMinutes: item.estimated_minutes || null,
  }
}

// Prev/next among siblings linked to the same feature_node, ordered by feature_node_records.order.
// Skips over any candidate that isn't published (or was deleted) rather than stopping at the first gap.
async function getOrderAdjacent(sourceType, sourceId) {
  const recordType = ORDER_RECORD_TYPE[sourceType]
  const modelName = ORDER_MODEL_NAME[sourceType]

  const link = await prisma.feature_node_records.findFirst({ where: { record_type: recordType, record_id: sourceId } })
  if (!link || link.order === null) return []

  const directions = [
    { relationType: 'prev', where: { lt: link.order }, sort: 'desc' },
    { relationType: 'next', where: { gt: link.order }, sort: 'asc' },
  ]

  const results = []
  for (const { relationType, where, sort } of directions) {
    const candidates = await prisma.feature_node_records.findMany({
      where: { node_id: link.node_id, record_type: recordType, order: where },
      orderBy: { order: sort },
      take: 20,
    })
    for (const candidate of candidates) {
      const item = await prisma[modelName].findFirst({
        where: { id: candidate.record_id, status: 'published', is_deleted: false },
        select: ORDER_SELECT[sourceType],
      })
      if (item) {
        results.push({ relationType, ...serializeOrderItem(sourceType, candidate.id, item) })
        break
      }
    }
  }
  return results
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

      if (sourceType === targetType && ORDER_RECORD_TYPE[sourceType]) {
        const resolved = await getOrderAdjacent(sourceType, sourceId)
        return res.status(200).json({ data: resolved })
      }

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
