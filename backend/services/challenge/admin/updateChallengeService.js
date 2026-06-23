import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'

export class UpdateChallengeService {
  static async call({ uniqueId, title, description, scoringType, durationSeconds, specialDurationSeconds, totalQuestions, basePointsPerCorrect, secondsPerQuestion, maxSpecialPerSession, status, startAt, endAt, tagIds }) {
    const challenge = await prisma.challenges.findUnique({ where: { unique_id: uniqueId } })
    if (!challenge || challenge.is_deleted) throw new ValidationError('Challenge not found')

    if (scoringType && !['classic', 'blitz'].includes(scoringType)) {
      throw new ValidationError('Scoring type must be classic or blitz')
    }

    await prisma.$transaction(async (tx) => {
      await tx.challenges.update({
        where: { unique_id: uniqueId },
        data: {
          title: title ?? challenge.title,
          description: description !== undefined ? description : challenge.description,
          scoring_type: scoringType ?? challenge.scoring_type,
          duration_seconds: durationSeconds != null ? parseInt(durationSeconds) : challenge.duration_seconds,
          total_questions: totalQuestions != null ? parseInt(totalQuestions) : challenge.total_questions,
          base_points_per_correct: basePointsPerCorrect != null ? parseInt(basePointsPerCorrect) : challenge.base_points_per_correct,
          seconds_per_question: secondsPerQuestion != null ? parseInt(secondsPerQuestion) : challenge.seconds_per_question,
          max_special_per_session: maxSpecialPerSession != null ? parseInt(maxSpecialPerSession) : challenge.max_special_per_session,
          special_duration_seconds: specialDurationSeconds != null ? parseInt(specialDurationSeconds) : challenge.special_duration_seconds,
          status: status ?? challenge.status,
          start_at: startAt !== undefined ? (startAt ? new Date(startAt) : null) : challenge.start_at,
          end_at: endAt !== undefined ? (endAt ? new Date(endAt) : null) : challenge.end_at,
          updated_at: new Date(),
        },
      })

      if (Array.isArray(tagIds)) {
        await tx.challenge_tags.deleteMany({ where: { challenge_id: challenge.id } })
        if (tagIds.length > 0) {
          await tx.challenge_tags.createMany({
            data: tagIds.map(id => ({ challenge_id: challenge.id, tag_id: parseInt(id) })),
            skipDuplicates: true,
          })
        }
      }
    })

    return prisma.challenges.findUnique({
      where: { unique_id: uniqueId },
      include: { challenge_tags: { include: { tags: true } } },
    })
  }
}
