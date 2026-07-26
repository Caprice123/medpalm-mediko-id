import prisma from '#prisma/client'
import idriveService from '#services/idrive.service'

export async function buildDiagnosticSessionCards({ selected, newIdSet, node, nodeMap }) {
  const questions = await prisma.diagnostic_questions.findMany({ where: { id: { in: selected } } })
  const qMap = new Map(questions.map(q => [q.id, q]))

  const attachments = await prisma.attachments.findMany({
    where: { record_type: 'diagnostic_question', record_id: { in: selected }, name: 'image' },
  })
  const blobIds = attachments.map(a => a.blob_id)
  const blobs = blobIds.length > 0
    ? await prisma.blobs.findMany({ where: { id: { in: blobIds } } })
    : []

  const attachmentMap = new Map(attachments.map(a => [a.record_id, a]))
  const blobMap = new Map(blobs.map(b => [b.id, b]))

  const blobKeys = []
  const qBlobKeyMap = new Map()
  selected.forEach(id => {
    const att = attachmentMap.get(id)
    if (att) {
      const blob = blobMap.get(att.blob_id)
      if (blob) { blobKeys.push(blob.key); qBlobKeyMap.set(id, blob.key) }
    }
  })

  const presignedUrls = blobKeys.length > 0
    ? await idriveService.getBulkSignedUrls(blobKeys, 3600)
    : []

  const urlMap = new Map()
  let idx = 0
  selected.forEach(id => { if (qBlobKeyMap.has(id)) urlMap.set(id, presignedUrls[idx++]) })

  return selected.map(id => {
    const q = qMap.get(id)
    if (!q) return null

    let subtopicInfo, topicInfo
    if (nodeMap) {
      const n = nodeMap.get(id)
      subtopicInfo = n ? { id: n.id, name: n.name } : null
      topicInfo = n?.parent ? { id: n.parent.id, name: n.parent.name } : null
    } else if (node) {
      subtopicInfo = { id: node.id, name: node.name }
      topicInfo = node.parent ? { id: node.parent.id, name: node.parent.name } : null
    } else {
      subtopicInfo = null
      topicInfo = null
    }

    return {
      id: q.id,
      question: q.question,
      vignette: q.vignette,
      imageUrl: urlMap.get(id) || null,
      imageCaption: q.image_caption,
      explanation: q.explanation ?? null,
      answerType: q.answer_type,
      choices: q.choices,
      answer: q.answer,
      isNew: newIdSet ? newIdSet.has(id) : false,
      subtopic: subtopicInfo,
      topic: topicInfo,
    }
  }).filter(Boolean)
}
