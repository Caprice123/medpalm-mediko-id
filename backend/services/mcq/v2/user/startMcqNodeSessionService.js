import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import idriveService from '#services/idrive.service'

export class StartMcqNodeSessionService extends BaseService {
  static async call({ userId, nodeId, count }) {
    const node = await prisma.feature_nodes.findUnique({ where: { id: parseInt(nodeId) } })
    if (!node) throw new ValidationError('Sub-topik tidak ditemukan')

    const refs = await prisma.feature_node_records.findMany({
      where: { node_id: parseInt(nodeId), record_type: 'mcq_question' },
      select: { record_id: true },
    })
    if (refs.length === 0) return []

    const allIds = refs.map(r => r.record_id)
    const limit = parseInt(count) || allIds.length
    const selected = allIds.sort(() => Math.random() - 0.5).slice(0, limit)

    const questionToNode = new Map(selected.map(id => [id, parseInt(nodeId)]))
    return buildQuestionsResponse(selected, questionToNode, userId)
  }
}

export async function buildQuestionsResponse(selectedIds, questionToNodeMap, userId) {
  const questions = await prisma.mcq_questions.findMany({ where: { id: { in: selectedIds } } })
  const qMap = new Map(questions.map(q => [q.id, q]))
  const ordered = selectedIds.map(id => qMap.get(id)).filter(Boolean)

  // Fetch node names and parent ids
  const nodeIds = [...new Set([...questionToNodeMap.values()].filter(Boolean))]
  const nodes = nodeIds.length > 0
    ? await prisma.feature_nodes.findMany({
        where: { id: { in: nodeIds } },
        select: { id: true, name: true, parent_id: true },
      })
    : []
  const nodeMap = new Map(nodes.map(n => [n.id, n]))

  // Fetch parent (topic) names
  const parentIds = [...new Set(nodes.map(n => n.parent_id).filter(Boolean))]
  const parents = parentIds.length > 0
    ? await prisma.feature_nodes.findMany({
        where: { id: { in: parentIds } },
        select: { id: true, name: true },
      })
    : []
  const parentMap = new Map(parents.map(p => [p.id, p]))

  // Determine which questions the user has already answered
  const seenLogs = userId && selectedIds.length > 0
    ? await prisma.user_learned_items.findMany({
        where: { user_id: userId, item_type: 'mcq_question', item_id: { in: selectedIds } },
        select: { item_id: true },
      })
    : []
  const seenQuestionIds = new Set(seenLogs.map(l => l.item_id))

  // Fetch images
  const attachments = await prisma.attachments.findMany({
    where: { record_type: 'mcq_question', record_id: { in: selectedIds }, name: 'image' },
  })
  const blobIds = attachments.map(a => a.blob_id)
  const blobs = blobIds.length > 0 ? await prisma.blobs.findMany({ where: { id: { in: blobIds } } }) : []
  const attMap = new Map(attachments.map(a => [a.record_id, a]))
  const blobMap = new Map(blobs.map(b => [b.id, b]))

  const blobKeys = []
  const qBlobKeyMap = new Map()
  ordered.forEach(q => {
    const att = attMap.get(q.id)
    if (att) {
      const blob = blobMap.get(att.blob_id)
      if (blob) { blobKeys.push(blob.key); qBlobKeyMap.set(q.id, blob.key) }
    }
  })

  const urls = blobKeys.length > 0 ? await idriveService.getBulkSignedUrls(blobKeys, 3600) : []
  const urlMap = new Map()
  let idx = 0
  ordered.forEach(q => { if (qBlobKeyMap.has(q.id)) urlMap.set(q.id, urls[idx++]) })

  return ordered.map(q => {
    const nodeId = questionToNodeMap.get(q.id) ?? null
    const node = nodeId ? nodeMap.get(nodeId) : null
    const parent = node?.parent_id ? parentMap.get(node.parent_id) : null
    return {
      id: q.id,
      nodeId,
      question: q.question,
      options: q.options,
      correctIndex: q.correct_answer,
      explanation: q.explanation ?? null,
      references: q.references ?? [],
      imageUrl: urlMap.get(q.id) || null,
      subtopic: node ? node.name : null,
      topic: parent ? parent.name : null,
      isNew: !seenQuestionIds.has(q.id),
    }
  })
}
