import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'

export class CreateChallengeService {
  static async call({ title, description, scoringType, durationMinutes, specialDurationMinutes, totalQuestions, basePointsPerCorrect, timeBonusPool, timeBonusMultiplier, maxSpecialPerSession, status, startAt, endAt, createdBy, tagIds }) {
    this.validate({ title, scoringType, durationMinutes, totalQuestions })

    const challenge = await prisma.challenges.create({
      data: {
        title,
        description: description || null,
        scoring_type: scoringType,
        duration_minutes: parseInt(durationMinutes),
        total_questions: parseInt(totalQuestions),
        base_points_per_correct: basePointsPerCorrect != null ? parseInt(basePointsPerCorrect) : 100,
        time_bonus_pool: timeBonusPool != null ? parseFloat(timeBonusPool) : 50,
        time_bonus_multiplier: timeBonusMultiplier != null ? parseFloat(timeBonusMultiplier) : 5,
        max_special_per_session: maxSpecialPerSession != null ? parseInt(maxSpecialPerSession) : 0,
        special_duration_minutes: specialDurationMinutes != null ? parseInt(specialDurationMinutes) : 2,
        status: status || 'draft',
        start_at: startAt ? new Date(startAt) : null,
        end_at: endAt ? new Date(endAt) : null,
        created_by: createdBy,
      },
    })

    if (Array.isArray(tagIds) && tagIds.length > 0) {
      await prisma.challenge_tags.createMany({
        data: tagIds.map(id => ({ challenge_id: challenge.id, tag_id: parseInt(id) })),
        skipDuplicates: true,
      })
    }

    return prisma.challenges.findUnique({
      where: { id: challenge.id },
      include: { challenge_tags: { include: { tags: true } } },
    })
  }

  static validate({ title, scoringType, durationMinutes, totalQuestions }) {
    if (!title) throw new ValidationError('Title is required')
    if (!scoringType) throw new ValidationError('Scoring type is required')
    if (!['classic', 'blitz'].includes(scoringType)) throw new ValidationError('Scoring type must be classic or blitz')
    if (!durationMinutes || parseInt(durationMinutes) < 1) throw new ValidationError('Duration must be at least 1 minute')
    if (!totalQuestions || parseInt(totalQuestions) < 1) throw new ValidationError('Total questions must be at least 1')
  }
}
