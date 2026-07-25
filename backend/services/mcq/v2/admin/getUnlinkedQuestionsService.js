import { Prisma } from '@prisma/client'
import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import idriveService from '#services/idrive.service'

export class GetUnlinkedQuestionsService extends BaseService {
  static async call({ page = 1, perPage = 20, search = '' }) {
    const skip = (parseInt(page) - 1) * parseInt(perPage)
    const take = parseInt(perPage) + 1

    const searchFilter = search?.trim()
      ? Prisma.sql`AND mq.question ILIKE ${`%${search.trim()}%`}`
      : Prisma.empty

    const rawQuestions = await prisma.$queryRaw`
      SELECT mq.id, mq.topic_id, mq.question, mq.options, mq.correct_answer, mq.explanation, mq.order, mq.created_at, mq.updated_at
      FROM mcq_questions mq
      LEFT JOIN feature_node_records fnr
        ON fnr.record_type = 'mcq_question' AND fnr.record_id = mq.id
      WHERE fnr.id IS NULL
        ${searchFilter}
      ORDER BY mq.id DESC
      LIMIT ${take} OFFSET ${skip}
    `

    const isLastPage = rawQuestions.length <= parseInt(perPage)
    const questions = rawQuestions.slice(0, parseInt(perPage))
    const pagination = { page: parseInt(page), perPage: parseInt(perPage), isLastPage }

    if (questions.length === 0) return { questions, pagination }

    const questionIds = questions.map(q => q.id)
    const attachments = await prisma.attachments.findMany({
      where: { record_type: 'mcq_question', record_id: { in: questionIds }, name: 'image' },
    })

    const blobIds = attachments.map(a => a.blob_id)
    const blobs = blobIds.length > 0
      ? await prisma.blobs.findMany({ where: { id: { in: blobIds } } })
      : []

    const attachmentMap = new Map(attachments.map(a => [a.record_id, a]))
    const blobMap = new Map(blobs.map(b => [b.id, b]))

    const blobKeys = []
    const questionBlobKeyMap = new Map()
    questions.forEach(q => {
      const att = attachmentMap.get(q.id)
      if (att) {
        const blob = blobMap.get(att.blob_id)
        if (blob) { blobKeys.push(blob.key); questionBlobKeyMap.set(q.id, blob.key) }
      }
    })

    const presignedUrls = blobKeys.length > 0
      ? await idriveService.getBulkSignedUrls(blobKeys, 3600)
      : []

    const urlMap = new Map()
    let idx = 0
    questions.forEach(q => { if (questionBlobKeyMap.has(q.id)) urlMap.set(q.id, presignedUrls[idx++]) })

    const enriched = questions.map(q => {
      const att = attachmentMap.get(q.id)
      const blob = att ? blobMap.get(att.blob_id) : null
      return {
        ...q,
        imageUrl: urlMap.get(q.id) || null,
        imageBlobId: blob?.id ?? null,
      }
    })

    return { questions: enriched, pagination }
  }
}
