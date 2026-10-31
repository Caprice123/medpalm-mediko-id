import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class UpdateAnatomyQuizV2Service extends BaseService {
  static async call({ quizId, title, description, embedUrl, questionCount, status, difficulty, estimatedMinutes }) {
    if (!quizId || typeof quizId !== 'string') throw new ValidationError('Quiz ID wajib diisi')
    if (!title) throw new ValidationError('Judul wajib diisi')

    const existingQuiz = await prisma.anatomy_quizzes.findUnique({ where: { unique_id: quizId } })
    if (!existingQuiz) throw new ValidationError('Quiz tidak ditemukan')

    // No tag handling and no transaction: V2 quizzes are organised by the feature_nodes
    // tree, never by tag. The tag-clearing branch this used to open referenced an
    // undeclared `hasTags`, which threw a ReferenceError on every save.
    return prisma.anatomy_quizzes.update({
      where: { unique_id: quizId },
      data: {
        title,
        description: description || '',
        ...(status && { status }),
        embed_url: embedUrl || null,
        media_type: '3d',
        question_count: questionCount || 0,
        ...(difficulty && { difficulty }),
        ...(estimatedMinutes !== undefined && { estimated_minutes: estimatedMinutes ? parseInt(estimatedMinutes) : null }),
        updated_at: new Date(),
      },
    })
  }
}
