import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import attachmentService from '#services/attachment/attachmentService'
import { DateTime } from 'luxon'

const toJktIso = (date) => {
  if (!date) return null
  return DateTime.fromJSDate(new Date(date), { zone: 'Asia/Jakarta' }).toISO()
}

export class StartChallengeService {
  static async call({ challengeUniqueId, userId }) {
    const challenge = await prisma.challenges.findUnique({ where: { unique_id: challengeUniqueId } })
    if (!challenge || challenge.is_deleted) throw new ValidationError('Challenge not found')
    if (challenge.status !== 'active') throw new ValidationError('Challenge is not active')

    const now = new Date()
    if (challenge.start_at && now < challenge.start_at) throw new ValidationError('Challenge has not started yet')
    if (challenge.end_at && now > challenge.end_at) throw new ValidationError('Challenge has ended')

    const existing = await prisma.challenge_sessions.findFirst({
      where: { challenge_id: challenge.id, user_id: userId },
    })
    if (existing) {
      if (existing.status === 'completed') return { completed: true }
      return this.buildSessionResponse(challenge, existing)
    }

    const allQuestions = await prisma.challenge_questions.findMany({
      where: { challenge_id: challenge.id },
      select: { id: true, is_special: true },
    })

    let selectedIds

    if (challenge.scoring_type === 'blitz') {
      // Blitz: all regular questions (shuffled), then up to max_special_per_session specials
      const regularPool = allQuestions.filter(q => !q.is_special)
      const specialPool = allQuestions.filter(q => q.is_special)
      const shuffledRegular = [...regularPool].sort(() => Math.random() - 0.5)
      const maxSpecial = Math.min(challenge.max_special_per_session, specialPool.length)
      const drawnSpecial = [...specialPool].sort(() => Math.random() - 0.5).slice(0, maxSpecial)
      selectedIds = [...shuffledRegular, ...drawnSpecial].map(q => q.id)
    } else {
      // Classic: total_questions = number of regular questions to draw
      // Special questions are appended after all regular questions
      const specialPool = allQuestions.filter(q => q.is_special)
      const regularPool = allQuestions.filter(q => !q.is_special)

      if (regularPool.length < challenge.total_questions) {
        throw new ValidationError(`Not enough regular questions (need ${challenge.total_questions}, have ${regularPool.length})`)
      }

      const maxSpecial = Math.min(challenge.max_special_per_session, specialPool.length)

      const drawnRegular = [...regularPool].sort(() => Math.random() - 0.5).slice(0, challenge.total_questions)
      const drawnSpecial = [...specialPool].sort(() => Math.random() - 0.5).slice(0, maxSpecial)

      // Regular questions in random order, specials always last
      selectedIds = [
        ...drawnRegular.sort(() => Math.random() - 0.5),
        ...drawnSpecial.sort(() => Math.random() - 0.5),
      ].map(q => q.id)
    }

    const [session] = await prisma.$transaction([
      prisma.challenge_sessions.create({
        data: {
          challenge_id: challenge.id,
          user_id: userId,
          question_ids: selectedIds,
          status: 'in_progress',
        },
      }),
      prisma.challenges.update({
        where: { id: challenge.id },
        data: { participant_count: { increment: 1 } },
      }),
    ])

    return this.buildSessionResponse(challenge, session)
  }

  static async buildSessionResponse(challenge, session) {
    const questionIds = session.question_ids
    const questions = await prisma.challenge_questions.findMany({
      where: { id: { in: questionIds } },
      select: { id: true, unique_id: true, question: true, options: true, is_special: true },
    })

    const ordered = questionIds.map(id => questions.find(q => q.id === id)).filter(Boolean)

    const questionsWithImages = await Promise.all(
      ordered.map(async (q) => {
        const allAttachments = await attachmentService.getAttachmentsWithUrls({
          recordType: 'challenge_question',
          recordId: q.id,
        })
        const questionImage = allAttachments.find(a => a.name === 'question_image') || null
        const optionImages = (q.options || []).map((_, i) =>
          allAttachments.find(a => a.name === `option_image_${i}`) || null
        )
        return {
          uniqueId: q.unique_id,
          id: q.id,
          question: q.question,
          options: q.options,
          isSpecial: q.is_special,
          questionImage: questionImage ? { url: questionImage.url } : null,
          optionImages: optionImages.map(img => img ? { url: img.url } : null),
        }
      })
    )

    const existingAnswers = await prisma.challenge_session_answers.findMany({
      where: { session_id: session.id },
      select: { question_id: true, selected_option_index: true, time_taken_seconds: true },
    })

    const regularCount = questionsWithImages.filter(q => !q.isSpecial).length

    return {
      sessionUniqueId: session.unique_id,
      startedAt: toJktIso(session.started_at),
      endAt: toJktIso(challenge.end_at),
      durationSeconds: challenge.duration_seconds,
      specialDurationSeconds: challenge.special_duration_seconds,
      totalQuestions: questionIds.length,
      regularCount,
      scoringType: challenge.scoring_type,
      basePointsPerCorrect: challenge.base_points_per_correct,
      secondsPerQuestion: challenge.seconds_per_question,
      currentStreak: session.current_streak ?? 0,
      score: session.score ?? 0,
      questions: questionsWithImages,
      answeredQuestions: existingAnswers.map(a => ({
        questionId: a.question_id,
        selectedOptionIndex: a.selected_option_index,
        timeTakenSeconds: a.time_taken_seconds,
        isCorrect: a.is_correct,
      })),
    }
  }
}
