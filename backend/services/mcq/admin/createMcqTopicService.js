import { ValidationError } from '../../../errors/validationError.js'
import prisma from '../../../prisma/client.js'
import { BaseService } from '../../baseService.js'

export class CreateMcqTopicService extends BaseService {
  static async call({
    title,
    description,
    content_type,
    source_url,
    source_key,
    source_filename,
    quiz_time_limit = 0,
    passing_score = 70,
    tags,
    questions,
    created_by,
    status = 'draft'
  }) {
    // Validate inputs
    await this.validate({ title, content_type, tags, questions })

    // Create topic with questions and tags
    const topic = await prisma.mcq_topics.create({
      data: {
        title,
        description: description || '',
        content_type,
        source_url: source_url || null,
        source_key: source_key || null,
        source_filename: source_filename || null,
        quiz_time_limit,
        passing_score,
        status,
        created_by,
        mcq_questions: {
          create: questions.map((q, index) => ({
            question: q.question,
            image_url: q.image_url || null,
            image_key: q.image_key || null,
            image_filename: q.image_filename || null,
            options: q.options,
            correct_answer: q.correct_answer,
            explanation: q.explanation || null,
            order: q.order !== undefined ? q.order : index
          }))
        },
        mcq_topic_tags: {
          create: tags.map(tag => ({
            tag_id: typeof tag === 'object' ? Number(tag.id) : tag
          }))
        }
      },
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

    return topic
  }

  static async validate({ title, content_type, tags, questions }) {
    // Validate required fields
    if (!title) {
      throw new ValidationError('Title is required')
    }

    if (!content_type) {
      throw new ValidationError('Content type is required')
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
  }
}
