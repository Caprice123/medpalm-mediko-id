import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import attachmentService from '#services/attachment/attachmentService'

export class CreateMcqTopicService extends BaseService {
  static async call({
    title,
    description,
    contentType,
    content,
    blobId,
    quizTimeLimit = 0,
    passingScore = 70,
    tags,
    questions,
    createdBy,
    status = 'draft'
  }) {
    // Validate inputs
    await this.validate({ title, contentType, content, blobId, tags, questions })

    // Create topic with questions and tags in a transaction
    const topic = await prisma.$transaction(async (tx) => {
      // Create topic with tags
      const createdTopic = await tx.mcq_topics.create({
        data: {
          title,
          description: description || '',
          content_type: contentType,
          content: contentType === 'text' ? content : null,
          question_count: questions.length,
          quiz_time_limit: quizTimeLimit,
          passing_score: passingScore,
          status,
          created_by: createdBy,
          mcq_topic_tags: {
            create: tags.map(tag => ({
              tag_id: typeof tag === 'object' ? Number(tag.id) : tag
            }))
          }
        }
      })

      // Create attachment for topic PDF if blobId provided using attachmentService
      if (blobId && contentType === 'pdf') {
        await attachmentService.attach({
          name: 'pdf',
          recordType: 'mcq_topic',
          recordId: createdTopic.id,
          blobId: blobId
        })
      }

      // Create questions
      const createdQuestions = []
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i]
        const createdQuestion = await tx.mcq_questions.create({
          data: {
            topic_id: createdTopic.id,
            question: q.question,
            options: q.options,
            correct_answer: q.correct_answer,
            explanation: q.explanation || null,
            order: q.order !== undefined ? q.order : i
          }
        })
        createdQuestions.push(createdQuestion)

        // Create attachment if question has image using attachmentService
        if (q.blobId) {
          await attachmentService.attach({
            name: 'image',
            recordType: 'mcq_question',
            recordId: createdQuestion.id,
            blobId: q.blobId
          })
        }
      }

      // Return topic with relations
      return await tx.mcq_topics.findUnique({
        where: { id: createdTopic.id },
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
    })

    return topic
  }

  static async validate({ title, contentType, content, blobId, tags, questions }) {
    // Validate required fields
    if (!title) {
      throw new ValidationError('Title is required')
    }

    if (!contentType) {
      throw new ValidationError('Content type is required')
    }

    if (contentType === 'text' && !content) {
      throw new ValidationError('Content is required for text type')
    }

    if (contentType === 'pdf' && !blobId) {
      throw new ValidationError('Blob ID is required for PDF type')
    }

    if (!tags || tags.length === 0) {
      throw new ValidationError('At least one tag is required')
    }

    if (!questions || questions.length === 0) {
      throw new ValidationError('At least one question is required')
    }

    // Validate each question has options and correct answer
    questions.forEach((q, index) => {
      if (!q.question) {
        throw new ValidationError(`Question ${index + 1}: Question text is required`)
      }
      if (!Array.isArray(q.options) || q.options.length < 2) {
        throw new ValidationError(`Question ${index + 1}: At least 2 options are required`)
      }
      if (q.options.some(opt => !opt || opt.trim() === '')) {
        throw new ValidationError(`Question ${index + 1}: All options must have content`)
      }
      if (typeof q.correct_answer !== 'number' || q.correct_answer < 0 || q.correct_answer >= q.options.length) {
        throw new ValidationError(`Question ${index + 1}: Correct answer must be a valid option index (0 to ${q.options.length - 1})`)
      }
    })

    // Validate tags exist
    const tagIds = tags.map(t => (typeof t === 'object' ? Number(t.id) : t))
    const existingTags = await prisma.tags.findMany({
      where: {
        id: { in: tagIds },
        is_active: true
      }
    })

    if (existingTags.length !== tagIds.length) {
      throw new ValidationError('Some tags are invalid or inactive')
    }

    // Validate blob exists if provided
    if (blobId) {
      const blob = await prisma.blobs.findUnique({
        where: { id: blobId }
      })
      if (!blob) {
        throw new ValidationError('Invalid blob ID')
      }
    }
  }
}
