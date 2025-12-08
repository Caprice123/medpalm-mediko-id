import { ValidationError } from '../../../errors/validationError.js'
import prisma from '../../../prisma/client.js'
import { BaseService } from '../../baseService.js'

export class CreateAnatomyQuizService extends BaseService {
  static async call({
    title,
    description,
    image_url,
    image_key,
    image_filename,
    tags,
    questions,
    created_by,
    status = 'draft'
  }) {
    // Validate inputs
    await this.validate({ title, image_url, tags, questions })

    // Create quiz with questions and tags
    const quiz = await prisma.anatomy_quizzes.create({
      data: {
        title,
        description: description || '',
        image_url,
        image_key,
        image_filename,
        status,
        created_by,
        anatomy_questions: {
          create: questions.map((q, index) => ({
            question: q.label,
            answer: q.answer,
            explanation: q.explanation || '',
            order: q.order !== undefined ? q.order : index
          }))
        },
        anatomy_quiz_tags: {
          create: tags.map(tag => ({
            tag_id: typeof tag === 'object' ? Number(tag.id) : tag
          }))
        }
      },
      include: {
        anatomy_questions: {
          orderBy: { order: 'asc' }
        },
        anatomy_quiz_tags: {
          include: {
            tags: true
          }
        }
      }
    })

    return quiz
  }

  static async validate({ title, image_url, tags, questions }) {
    // Validate required fields
    if (!title) {
      throw new ValidationError('Title is required')
    }

    if (!image_url) {
      throw new ValidationError('Image URL is required')
    }

    if (!tags || tags.length === 0) {
      throw new ValidationError('At least one tag is required')
    }

    if (!questions || questions.length === 0) {
      throw new ValidationError('At least one question is required')
    }

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
