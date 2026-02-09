import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import attachmentService from '#services/attachment/attachmentService'

export class UpdateMcqTopicService extends BaseService {
  static async call({
    id,
    title,
    description,
    contentType,
    content,
    blobId,
    quizTimeLimit,
    passingScore,
    tags,
    questions,
    status,
    isActive
  }) {
    // Validate topic exists
    const existingTopic = await prisma.mcq_topics.findUnique({
      where: { unique_id: id }
    })

    if (!existingTopic) {
      throw new ValidationError('MCQ topic not found')
    }

    // Validate inputs if provided
    if (tags || questions) {
      await this.validate({ tags, questions })
    }

    // Validate blobId if provided
    if (blobId) {
      const blob = await prisma.blobs.findUnique({
        where: { id: blobId }
      })
      if (!blob) {
        throw new ValidationError('Invalid blob ID')
      }
    }

    // Update topic in transaction
    const topic = await prisma.$transaction(async (tx) => {
      // Build update data
      const updateData = {}
      if (title !== undefined) updateData.title = title
      if (description !== undefined) updateData.description = description
      if (contentType !== undefined) updateData.content_type = contentType
      if (quizTimeLimit !== undefined) updateData.quiz_time_limit = quizTimeLimit
      if (passingScore !== undefined) updateData.passing_score = passingScore
      if (status !== undefined) updateData.status = status

      // Determine final contentType (use new if provided, otherwise keep existing)
      const finalContentType = contentType !== undefined ? contentType : existingTopic.content_type

      // Handle content and blob based on contentType
      if (finalContentType === 'text') {
        // Text content: save content, remove PDF blob
        updateData.content = content || null

        // Delete existing PDF attachment
        await tx.attachments.deleteMany({
          where: {
            record_type: 'mcq_topic',
            record_id: existingTopic.id,
            name: 'pdf'
          }
        })
      } else if (finalContentType === 'pdf') {
        // PDF content: clear content, attach blob
        updateData.content = null

        // Delete existing PDF attachment first
        await tx.attachments.deleteMany({
          where: {
            record_type: 'mcq_topic',
            record_id: existingTopic.id,
            name: 'pdf'
          }
        })

        // Create new attachment if blobId is provided
        if (blobId) {
          await attachmentService.attach({
            name: 'pdf',
            recordType: 'mcq_topic',
            recordId: existingTopic.id,
            blobId: blobId
          })
        }
      }

      // Update basic fields
      await tx.mcq_topics.update({
        where: { unique_id: id },
        data: updateData
      })

      // Update questions if provided
      if (questions) {
        // Update question count
        await tx.mcq_topics.update({
          where: { unique_id: id },
          data: { question_count: questions.length }
        })

        // Get existing questions to delete their attachments
        const existingQuestions = await tx.mcq_questions.findMany({
          where: { topic_id: existingTopic.id }
        })

        // Delete attachments for existing questions
        if (existingQuestions.length > 0) {
          await tx.attachments.deleteMany({
            where: {
              record_type: 'mcq_question',
              record_id: { in: existingQuestions.map(q => q.id) }
            }
          })
        }

        // Delete existing questions
        await tx.mcq_questions.deleteMany({
          where: { topic_id: existingTopic.id }
        })

        // Create new questions
        const createdQuestions = []
        for (let i = 0; i < questions.length; i++) {
          const q = questions[i]
          const createdQuestion = await tx.mcq_questions.create({
            data: {
              topic_id: existingTopic.id,
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
      }

      // Update tags if provided
      if (tags) {
        // Delete existing tags
        await tx.mcq_topic_tags.deleteMany({
          where: { topic_id: existingTopic.id }
        })

        // Create new tags
        await tx.mcq_topic_tags.createMany({
          data: tags.map(tag => ({
            topic_id: existingTopic.id,
            tag_id: typeof tag === 'object' ? Number(tag.id) : tag
          }))
        })
      }

      // Return updated topic with relations
      return await tx.mcq_topics.findUnique({
        where: { unique_id: id },
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

  static async validate({ tags, questions }) {
    // Validate tags if provided
    if (tags) {
      if (tags.length === 0) {
        throw new ValidationError('At least one tag is required')
      }

      const tagIds = tags.map(t => (typeof t === 'object' ? Number(t.id) : t))
      const existingTags = await prisma.tags.findMany({
        where: {
          id: { in: tagIds },
        }
      })

      if (existingTags.length !== tagIds.length) {
        throw new ValidationError('Some tags are invalid or inactive')
      }
    }

    // Validate questions if provided
    if (questions) {
      if (questions.length === 0) {
        throw new ValidationError('At least one question is required')
      }

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
    }
  }
}
