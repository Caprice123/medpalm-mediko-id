import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import idriveService from '#services/idrive.service'

export class GetMcqTopicDetailService extends BaseService {
  static async call({ id }) {
    const topic = await prisma.mcq_topics.findUnique({
      where: { id },
      include: {
        mcq_questions: {
          orderBy: { order: 'asc' }
        },
        mcq_topic_tags: {
          include: {
            tags: {
              include: {
                tag_group: true
              }
            }
          }
        }
      }
    })

    if (!topic) {
      throw new ValidationError('MCQ topic not found')
    }

    // Get topic PDF attachment
    const topicPdfAttachment = await prisma.attachments.findFirst({
      where: {
        record_type: 'mcq_topic',
        record_id: id,
        name: 'pdf'
      },
      include: {
        blob: true
      }
    })

    // Get attachments for all questions
    const questionIds = topic.mcq_questions.map(q => q.id)
    const attachments = await prisma.attachments.findMany({
      where: {
        record_type: 'mcq_question',
        record_id: { in: questionIds },
        name: 'image'
      }
    })

    // Get blobs for all attachments
    const blobIds = attachments.map(a => a.blob_id)
    const blobs = await prisma.blobs.findMany({
      where: { id: { in: blobIds } }
    })

    // Create maps for quick lookup
    const attachmentMap = new Map()
    attachments.forEach(att => {
      attachmentMap.set(att.record_id, att)
    })

    const blobMap = new Map()
    blobs.forEach(blob => {
      blobMap.set(blob.id, blob)
    })

    // Get blob keys for presigned URL generation
    const blobKeys = []
    const questionBlobKeyMap = new Map()
    let topicPdfBlobKey = null

    // Add topic PDF blob key if exists
    if (topicPdfAttachment?.blob) {
      blobKeys.push(topicPdfAttachment.blob.key)
      topicPdfBlobKey = topicPdfAttachment.blob.key
    }

    topic.mcq_questions.forEach(question => {
      const attachment = attachmentMap.get(question.id)
      if (attachment) {
        const blob = blobMap.get(attachment.blob_id)
        if (blob) {
          blobKeys.push(blob.key)
          questionBlobKeyMap.set(question.id, blob.key)
        }
      }
    })

    // Generate presigned URLs (bulk operation)
    const presignedUrls = blobKeys.length > 0
      ? await idriveService.getBulkSignedUrls(blobKeys, 3600)
      : []

    // Map presigned URLs back
    let urlIndex = 0
    const topicPdfUrl = topicPdfBlobKey ? presignedUrls[urlIndex++] : null

    const urlMap = new Map()
    topic.mcq_questions.forEach(question => {
      if (questionBlobKeyMap.has(question.id)) {
        urlMap.set(question.id, presignedUrls[urlIndex++])
      }
    })

    // Add image data to questions
    topic.mcq_questions = topic.mcq_questions.map(question => {
      const attachment = attachmentMap.get(question.id)
      const blob = attachment ? blobMap.get(attachment.blob_id) : null

      return {
        ...question,
        image: blob ? {
          id: blob.id,
          url: urlMap.get(question.id) || null, // Presigned URL for display
          key: blob.key,
          filename: blob.filename,
          contentType: blob.content_type,
          byteSize: blob.byte_size
        } : null
      }
    })

    // Add PDF blob data to topic
    topic.pdf = topicPdfAttachment?.blob ? {
      id: topicPdfAttachment.blob.id,
      url: topicPdfUrl, // Presigned URL for display/download
      key: topicPdfAttachment.blob.key,
      filename: topicPdfAttachment.blob.filename,
      contentType: topicPdfAttachment.blob.content_type,
      byteSize: topicPdfAttachment.blob.byte_size
    } : null

    return topic
  }
}
