import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import attachmentService from '#services/attachment/attachmentService'

export class CreateAnatomyQuizService extends BaseService {
  static async call({
    title,
    description,
    blobId,
    tags,
    questions,
    createdBy,
    status = 'draft'
  }) {
    // Validate inputs
    await this.validate({ title, blobId, tags, questions })

    // Create quiz with questions and tags
    const quiz = await prisma.anatomy_quizzes.create({
      data: {
        title,
        description: description || '',
        status,
        created_by: createdBy,
        anatomy_questions: {
          create: questions.map((q, index) => ({
            question: q.question,
            answer: q.answer,
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

    // Create attachment if blob is provided
    if (blobId) {
      await attachmentService.attach({
        blobId,
        recordType: 'anatomy_quiz',
        recordId: quiz.id,
        name: 'image'
      })
    }

    return quiz
  }

  static async validate({ title, blobId, tags, questions }) {
    // Validate required fields
    if (!title) {
      throw new ValidationError('Title is required')
    }

    if (!blobId) {
      throw new ValidationError('Image is required')
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
