import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import attachmentService from '#services/attachment/attachmentService'

export class UpdateAnatomyQuizService extends BaseService {
  static async call({ quizId, title, description, blobId, embedUrl, questionCount, mediaType, tags, questions, status }) {
    this.validate({ quizId, title, embedUrl, questionCount, tags, questions })

    const existingQuiz = await prisma.anatomy_quizzes.findUnique({ where: { unique_id: quizId } })
    if (!existingQuiz) throw new ValidationError('Quiz tidak ditemukan')

    const hasTags = tags !== undefined && tags !== null

    const updatedQuiz = await prisma.$transaction(async tx => {
      await tx.anatomy_questions.deleteMany({ where: { quiz_id: existingQuiz.id } })

      if (hasTags) {
        await tx.anatomy_quiz_tags.deleteMany({ where: { quiz_id: existingQuiz.id } })
      }

      return tx.anatomy_quizzes.update({
        where: { unique_id: quizId },
        data: {
          title,
          description: description || '',
          ...(status && { status }),
          embed_url: embedUrl || null,
          media_type: mediaType || (embedUrl ? '3d' : '2d'),
          updated_at: new Date(),
          anatomy_questions: {
            create: questions.map((q, index) => ({
              question: q.question,
              answer: q.answer,
              answer_type: q.answerType || q.answer_type || 'text',
              choices: q.choices || null,
              order: q.order !== undefined ? q.order : index,
            })),
          },
          question_count: embedUrl ? (questionCount || 0) : questions.length,
          ...(hasTags && tags.length > 0 ? {
            anatomy_quiz_tags: {
              create: tags.map(tag => ({ tag_id: typeof tag === 'object' ? tag.id : tag }))
            }
          } : {}),
        },
        include: {
          anatomy_questions: { orderBy: { order: 'asc' } },
          anatomy_quiz_tags: { include: { tags: true } },
        },
      })
    })

    if (blobId) {
      const oldAttachment = await prisma.attachments.findFirst({
        where: { record_type: 'anatomy_quiz', record_id: existingQuiz.id, name: 'image' },
      })
      if (oldAttachment) await attachmentService.deleteAttachment(oldAttachment.id, false)
      await attachmentService.attach({ blobId, recordType: 'anatomy_quiz', recordId: updatedQuiz.id, name: 'image' })
    }

    return updatedQuiz
  }

  static validate({ quizId, title, embedUrl, questionCount, tags, questions }) {
    if (!quizId || typeof quizId !== 'string') throw new ValidationError('Quiz ID wajib diisi')
    if (!title) throw new ValidationError('Judul wajib diisi')
    if (!questions || !Array.isArray(questions)) throw new ValidationError('Array pertanyaan wajib ada')
    if (!embedUrl && questions.length === 0) throw new ValidationError('Minimal satu pertanyaan diperlukan jika tidak menggunakan embed URL')
    if (embedUrl && (!questionCount || questionCount < 1)) throw new ValidationError('Jumlah pertanyaan wajib diisi dan minimal 1 untuk kuis embed 3D')

    questions.forEach((q, index) => {
      if (!q.question) throw new ValidationError(`Pertanyaan ${index + 1}: teks pertanyaan wajib diisi`)
      if (!q.answer) throw new ValidationError(`Pertanyaan ${index + 1}: jawaban wajib diisi`)
      const answerType = q.answerType || q.answer_type || 'text'
      if (answerType === 'multiple_choice') {
        if (!q.choices || q.choices.length < 2) throw new ValidationError(`Pertanyaan ${index + 1}: minimal 2 pilihan diperlukan`)
        if (!q.choices.includes(q.answer)) throw new ValidationError(`Pertanyaan ${index + 1}: jawaban harus salah satu dari pilihan`)
      }
    })
  }
}
