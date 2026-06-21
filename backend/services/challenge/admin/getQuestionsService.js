import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import attachmentService from '#services/attachment/attachmentService'

export class GetQuestionsService {
  static async call({ challengeUniqueId, page = 1, perPage = 50 }) {
    const challenge = await prisma.challenges.findUnique({ where: { unique_id: challengeUniqueId } })
    if (!challenge || challenge.is_deleted) throw new ValidationError('Challenge not found')

    const p = parseInt(page)
    const pp = parseInt(perPage)

    const data = await prisma.challenge_questions.findMany({
      where: { challenge_id: challenge.id },
      orderBy: [{ order: 'asc' }, { created_at: 'asc' }],
      take: pp + 1,
      skip: (p - 1) * pp,
    })

    const isLastPage = data.length <= pp
    const questions = data.slice(0, pp)

    const questionsWithImages = await Promise.all(
      questions.map(async (q) => {
        const allAttachments = await attachmentService.getAttachmentsWithUrls({
          recordType: 'challenge_question',
          recordId: q.id,
        })
        const questionImage = allAttachments.find(a => a.name === 'question_image') || null
        const optionImages = (q.options || []).map((_, i) =>
          allAttachments.find(a => a.name === `option_image_${i}`) || null
        )
        return { ...q, questionImage, optionImages }
      })
    )

    return {
      data: questionsWithImages,
      pagination: { page: p, perPage: pp, isLastPage },
    }
  }
}
