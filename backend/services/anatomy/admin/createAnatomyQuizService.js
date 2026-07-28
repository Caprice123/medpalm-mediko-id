import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import attachmentService from '#services/attachment/attachmentService'

export class CreateAnatomyQuizService extends BaseService {
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
    status = 'draft',
    version = 1
  }) {
    const qs = questions || []
    await this.validate({ title, blobId, embedUrl, questionCount, tags, questions: qs, version })

    const finalQuestionCount = embedUrl ? (questionCount || 0) : qs.length
    const normalizedTags = (tags || []).map(tag => ({
      tag_id: typeof tag === 'object' ? Number(tag.id) : tag
    }))

    const quiz = await prisma.anatomy_quizzes.create({
      data: {
        title,
        description: description || '',
        status,
        embed_url: embedUrl || null,
        media_type: mediaType || (embedUrl ? '3d' : '2d'),
        version,
        created_by: createdBy,
        anatomy_questions: {
          create: qs.map((q, index) => ({
            question: q.question,
            answer: q.answer,
            answer_type: q.answerType || q.answer_type || 'text',
            choices: q.choices || null,
            order: q.order !== undefined ? q.order : index
          }))
        },
        question_count: finalQuestionCount,
        ...(normalizedTags.length > 0 && {
          anatomy_quiz_tags: { create: normalizedTags }
        }),
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

  static async validate({ title, blobId, embedUrl, questionCount, tags, questions = [], version = 1 }) {
    if (!title) {
      throw new ValidationError('Judul wajib diisi')
    }

    if (!blobId && !embedUrl) {
      throw new ValidationError('Gambar atau embed URL wajib diisi')
    }

    if (embedUrl && (!questionCount || questionCount < 1)) {
      throw new ValidationError('Jumlah pertanyaan wajib diisi dan minimal 1 untuk embed 3D')
    }

    if (version !== 2 && (!tags || tags.length === 0)) {
      throw new ValidationError('Minimal satu tag wajib dipilih')
    }

    if (!embedUrl && (!questions || questions.length === 0)) {
      throw new ValidationError('Minimal satu pertanyaan wajib diisi jika tidak menggunakan embed URL')
    }

    questions.forEach((q, index) => {
      if (!q.question || typeof q.question !== 'string') {
        throw new ValidationError(`Pertanyaan ${index + 1}: teks pertanyaan wajib diisi`)
      }
      if (!q.answer || typeof q.answer !== 'string') {
        throw new ValidationError(`Pertanyaan ${index + 1}: jawaban wajib diisi`)
      }

      const answerType = q.answerType || q.answer_type || 'text'
      if (answerType === 'multiple_choice') {
        if (!q.choices || !Array.isArray(q.choices) || q.choices.length < 2) {
          throw new ValidationError(`Pertanyaan ${index + 1}: pilihan ganda harus memiliki minimal 2 pilihan`)
        }
        if (!q.choices.includes(q.answer)) {
          throw new ValidationError(`Pertanyaan ${index + 1}: jawaban harus salah satu dari pilihan yang tersedia`)
        }
      }
    })

    if (tags && tags.length > 0) {
      const tagIds = tags.map(t => (typeof t === 'object' ? Number(t.id) : t))
      const existingTags = await prisma.tags.findMany({ where: { id: { in: tagIds } } })
      if (existingTags.length !== tagIds.length) {
        throw new ValidationError('Beberapa tag tidak valid')
      }
    }
  }
}
