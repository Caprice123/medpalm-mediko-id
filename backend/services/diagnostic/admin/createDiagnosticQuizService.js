import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import attachmentService from '#services/attachment/attachmentService'

export class CreateDiagnosticQuizService extends BaseService {
  static async call({
    title,
    description,
    blobId,
    embedUrl,
    questionCount,
    mediaType,
    tags,
    questions,
    createdBy,
    status = 'draft'
  }) {
    const qs = questions || []
    // Validate inputs
    await this.validate({ title, blobId, embedUrl, questionCount, tags, questions: qs })

    // For embed quizzes: use the manually provided questionCount
    // For upload quizzes: derive it from the actual questions array
    const finalQuestionCount = embedUrl ? (questionCount || 0) : qs.length

    // Create quiz with questions and tags
    const quiz = await prisma.diagnostic_quizzes.create({
      data: {
        title,
        description: description || '',
        status,
        embed_url: embedUrl || null,
        media_type: mediaType || (embedUrl ? '3d' : '2d'),
        created_by: createdBy,
        diagnostic_questions: {
          create: qs.map((q, index) => ({
            question: q.question,
            answer: q.answer,
            answer_type: q.answerType || q.answer_type || 'text',
            choices: q.choices || null,
            order: q.order !== undefined ? q.order : index
          }))
        },
        question_count: finalQuestionCount,
        diagnostic_quiz_tags: {
          create: tags.map(tag => ({
            tag_id: typeof tag === 'object' ? Number(tag.id) : tag
          }))
        }
      },
      include: {
        diagnostic_questions: {
          orderBy: { order: 'asc' }
        },
        diagnostic_quiz_tags: {
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
        recordType: 'diagnostic_quiz',
        recordId: quiz.id,
        name: 'image'
      })
    }

    return quiz
  }

  static async validate({ title, blobId, embedUrl, questionCount, tags, questions = [] }) {
    // Validate required fields
    if (!title) {
      throw new ValidationError('Title is required')
    }

    if (!blobId && !embedUrl) {
      throw new ValidationError('Either an image or an embed URL is required')
    }

    if (embedUrl && (!questionCount || questionCount < 1)) {
      throw new ValidationError('Question count is required and must be at least 1 for 3D embed quizzes')
    }

    if (!tags || tags.length === 0) {
      throw new ValidationError('At least one tag is required')
    }

    // Questions are only required when there is no embed URL
    if (!embedUrl && (!questions || questions.length === 0)) {
      throw new ValidationError('At least one question is required when not using an embed URL')
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
