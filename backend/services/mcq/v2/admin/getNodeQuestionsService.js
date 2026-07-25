import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import idriveService from '#services/idrive.service'

async function enrichWithImages(questions) {
  if (questions.length === 0) return questions
  const ids = questions.map(q => q.id)
  const attachments = await prisma.attachments.findMany({
    where: { record_type: 'mcq_question', record_id: { in: ids }, name: 'image' },
  })
  const blobIds = attachments.map(a => a.blob_id)
  const blobs = blobIds.length > 0
    ? await prisma.blobs.findMany({ where: { id: { in: blobIds } } })
    : []
  const attMap = new Map(attachments.map(a => [a.record_id, a]))
  const blobMap = new Map(blobs.map(b => [b.id, b]))
  const blobKeys = []
  const qBlobKeyMap = new Map()
  questions.forEach(q => {
    const att = attMap.get(q.id)
    if (att) {
      const blob = blobMap.get(att.blob_id)
      if (blob) { blobKeys.push(blob.key); qBlobKeyMap.set(q.id, blob.key) }
    }
  })
  const urls = blobKeys.length > 0 ? await idriveService.getBulkSignedUrls(blobKeys, 3600) : []
  const urlMap = new Map()
  let idx = 0
  questions.forEach(q => { if (qBlobKeyMap.has(q.id)) urlMap.set(q.id, urls[idx++]) })
  return questions.map(q => {
    const att = attMap.get(q.id)
    const blob = att ? blobMap.get(att.blob_id) : null
    return { ...q, imageUrl: urlMap.get(q.id) || null, imageBlobId: blob?.id ?? null }
  })
}

export class GetNodeQuestionsService extends BaseService {
  static async call({ nodeId, page = 1, perPage = 20 }) {
    const skip = (parseInt(page) - 1) * parseInt(perPage)
    const take = parseInt(perPage) + 1

    const records = await prisma.feature_node_records.findMany({
      where: { node_id: parseInt(nodeId), record_type: 'mcq_question' },
      orderBy: { id: 'asc' },
      skip,
      take,
    })

    const isLastPage = records.length <= parseInt(perPage)
    const pageRecords = records.slice(0, parseInt(perPage))
    const pagination = { page: parseInt(page), perPage: parseInt(perPage), isLastPage }

    if (pageRecords.length === 0) return { questions: [], pagination }

    const questionIds = pageRecords.map(r => r.record_id)
    const rawQuestions = await prisma.mcq_questions.findMany({
      where: { id: { in: questionIds } },
    })

    const qMap = new Map(rawQuestions.map(q => [q.id, q]))
    const ordered = pageRecords.map(r => ({ ...qMap.get(r.record_id), nodeId: r.node_id })).filter(Boolean)

    const enriched = await enrichWithImages(ordered)
    return { questions: enriched, pagination }
  }
}

export { enrichWithImages }
