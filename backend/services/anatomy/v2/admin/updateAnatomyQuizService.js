import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class UpdateAnatomyQuizV2Service extends BaseService {
  static async call({ quizId, title, description, embedUrl, questionCount, tags, status }) {
    if (!quizId || typeof quizId !== 'string') throw new ValidationError('Quiz ID wajib diisi')
    if (!title) throw new ValidationError('Judul wajib diisi')

    const existingQuiz = await prisma.anatomy_quizzes.findUnique({ where: { unique_id: quizId } })
    if (!existingQuiz) throw new ValidationError('Quiz tidak ditemukan')

    const hasTags = tags !== undefined && tags !== null

    const updatedQuiz = await prisma.$transaction(async tx => {
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
          media_type: '3d',
          question_count: questionCount || 0,
          updated_at: new Date(),
          ...(hasTags && tags.length > 0 ? {
            anatomy_quiz_tags: {
              create: tags.map(tag => ({ tag_id: typeof tag === 'object' ? tag.id : tag }))
            }
          } : {}),
        },
      })
    })

    return updatedQuiz
  }
}
