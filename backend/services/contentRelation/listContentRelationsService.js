import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

async function resolveTargetDetails(relations) {
  const byType = {}
  for (const rel of relations) {
    if (!byType[rel.target_type]) byType[rel.target_type] = []
    byType[rel.target_type].push(rel.target_id)
  }

  const resolved = {}

  if (byType.mcq_topic?.length) {
    const topics = await prisma.mcq_topics.findMany({
      where: { id: { in: byType.mcq_topic } },
      select: { id: true, unique_id: true, title: true },
    })
    topics.forEach(t => { resolved[`mcq_topic:${t.id}`] = t })
  }

  if (byType.summary_note?.length) {
    const notes = await prisma.summary_notes.findMany({
      where: { id: { in: byType.summary_note } },
      select: { id: true, unique_id: true, title: true },
    })
    notes.forEach(n => { resolved[`summary_note:${n.id}`] = n })
  }

  if (byType.flashcard_deck?.length) {
    const decks = await prisma.flashcard_decks.findMany({
      where: { id: { in: byType.flashcard_deck } },
      select: { id: true, unique_id: true, title: true },
    })
    decks.forEach(d => { resolved[`flashcard_deck:${d.id}`] = d })
  }

  return relations.map(rel => {
    const item = resolved[`${rel.target_type}:${rel.target_id}`]
    return {
      id: rel.id,
      sourceType: rel.source_type,
      sourceId: rel.source_id,
      targetType: rel.target_type,
      targetId: rel.target_id,
      targetUniqueId: item?.unique_id || null,
      targetTitle: item?.title || null,
      order: rel.order,
    }
  })
}

export class ListContentRelationsService extends BaseService {
  static async call({ sourceType, sourceId }) {
    const relations = await prisma.content_relations.findMany({
      where: { source_type: sourceType, source_id: Number(sourceId) },
      orderBy: { order: 'asc' },
    })
    return resolveTargetDetails(relations)
  }
}
