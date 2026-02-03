import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import attachmentService from '#services/attachment/attachmentService'

export class UpdateAnatomyQuizService extends BaseService {
  static async call({
    quizId,
    title,
    description,
    blobId,
    tags,
    questions,
    status
  }) {
    this.validate({ quizId, title, tags, questions })

    // Check if quiz exists
    const existingQuiz = await prisma.anatomy_quizzes.findUnique({
      where: { id: parseInt(quizId) }
    })

    if (!existingQuiz) {
      throw new ValidationError('Quiz not found')
    }

    // Update quiz with questions and tags in a transaction
    const updatedQuiz = await prisma.$transaction(async tx => {
      // Delete existing questions and tags
      await tx.anatomy_questions.deleteMany({
        where: { quiz_id: parseInt(quizId) }
      })

      await tx.anatomy_quiz_tags.deleteMany({
        where: { quiz_id: parseInt(quizId) }
      })

      // Update quiz with new data
      const quiz = await tx.anatomy_quizzes.update({
        where: { id: parseInt(quizId) },
        data: {
          title,
          description: description || '',
          ...(status && { status }),
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
              tag_id: typeof tag === 'object' ? tag.id : tag
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
    })

    // Update attachment if new blob is provided
    if (blobId) {
      // Unlink old attachment (don't delete the blob)
      const oldAttachment = await prisma.attachments.findFirst({
        where: {
          record_type: 'anatomy_quiz',
          record_id: parseInt(quizId),
          name: 'image'
        }
      })

      if (oldAttachment) {
        await attachmentService.deleteAttachment(oldAttachment.id, false)
      }

      // Create new attachment
      await attachmentService.attach({
        blobId,
        recordType: 'anatomy_quiz',
        recordId: updatedQuiz.id,
        name: 'image'
      })
    }

    return updatedQuiz
  }

  static async validate({ quizId, title, tags, questions }) {
    if (!quizId) {
      throw new ValidationError('Quiz ID is required')
    }

    const id = parseInt(quizId)
    if (isNaN(id) || id <= 0) {
      throw new ValidationError('Invalid quiz ID')
    }

    if (!title) {
      throw new ValidationError('Title is required')
    }

    if (!tags || tags.length === 0) {
      throw new ValidationError('At least one tag is required')
    }

    if (!questions || !Array.isArray(questions)) {
      throw new ValidationError('Questions array is required')
    }

    if (questions.length === 0) {
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
    const tagIds = tags.map(t => (typeof t === 'object' ? t.id : t))
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
