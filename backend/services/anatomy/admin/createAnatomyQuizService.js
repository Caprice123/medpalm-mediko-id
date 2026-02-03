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
            answer_type: q.answerType || q.answer_type || 'text',
            choices: q.choices || null,
            order: q.order !== undefined ? q.order : index
          }))
        },
        question_count: questions.length,
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

    // Validate each question
    questions.forEach((q, index) => {
      if (!q.question || typeof q.question !== 'string') {
        throw new ValidationError(`Question ${index + 1}: question text is required`)
      }
      if (!q.answer || typeof q.answer !== 'string') {
        throw new ValidationError(`Question ${index + 1}: answer is required`)
      }

      const answerType = q.answerType || q.answer_type || 'text'
      if (answerType === 'multiple_choice') {
        if (!q.choices || !Array.isArray(q.choices) || q.choices.length < 2) {
          throw new ValidationError(`Question ${index + 1}: multiple choice questions must have at least 2 choices`)
        }
        // Validate that the answer matches one of the choices
        if (!q.choices.includes(q.answer)) {
          throw new ValidationError(`Question ${index + 1}: answer must be one of the provided choices`)
        }
      }
    })

    // Validate tags exist
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
}
