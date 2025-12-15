import { ValidationError } from '../../../errors/validationError.js'
import prisma from '../../../prisma/client.js'
import { BaseService } from '../../baseService.js'

export class UpdateMcqTopicService extends BaseService {
  static async call({
    id,
    title,
    description,
    content_type,
    source_url,
    source_key,
    source_filename,
    quiz_time_limit,
    passing_score,
    tags,
    questions,
    status,
    is_active
  }) {
    // Validate topic exists
    const existingTopic = await prisma.mcq_topics.findUnique({
      where: { id }
    })

    if (!existingTopic) {
      throw new ValidationError('MCQ topic not found')
    }

    // Validate inputs if provided
    if (tags || questions) {
      await this.validate({ tags, questions })
    }

    // Update topic in transaction
    const topic = await prisma.$transaction(async (tx) => {
      // Build update data
      const updateData = {}
      if (title !== undefined) updateData.title = title
      if (description !== undefined) updateData.description = description
      if (content_type !== undefined) updateData.content_type = content_type
      if (source_url !== undefined) updateData.source_url = source_url
      if (source_key !== undefined) updateData.source_key = source_key
      if (source_filename !== undefined) updateData.source_filename = source_filename
      if (quiz_time_limit !== undefined) updateData.quiz_time_limit = quiz_time_limit
      if (passing_score !== undefined) updateData.passing_score = passing_score
      if (status !== undefined) updateData.status = status
      if (is_active !== undefined) updateData.is_active = is_active

      // Update basic fields
      await tx.mcq_topics.update({
        where: { id },
        data: updateData
      })

      // Update questions if provided
      if (questions) {
        // Delete existing questions
        await tx.mcq_questions.deleteMany({
          where: { topic_id: id }
        })

        // Create new questions
        await tx.mcq_questions.createMany({
          data: questions.map((q, index) => ({
            topic_id: id,
            question: q.question,
            image_url: q.image_url || null,
            image_key: q.image_key || null,
            image_filename: q.image_filename || null,
            options: q.options,
            correct_answer: q.correct_answer,
            explanation: q.explanation || null,
            order: q.order !== undefined ? q.order : index
          }))
        })
      }

      // Update tags if provided
      if (tags) {
        // Delete existing tags
        await tx.mcq_topic_tags.deleteMany({
          where: { topic_id: id }
        })

        // Create new tags
        await tx.mcq_topic_tags.createMany({
          data: tags.map(tag => ({
            topic_id: id,
            tag_id: typeof tag === 'object' ? Number(tag.id) : tag
          }))
        })
      }

      // Return updated topic with relations
      return await tx.mcq_topics.findUnique({
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
          is_active: true
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
