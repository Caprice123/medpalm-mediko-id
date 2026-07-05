import prisma from '#prisma/client'

export class SaveAnswerService {
  static async call({ challengeUniqueId, userId, questionId, selectedOptionIndex, timeTakenSeconds }) {
    const challenge = await prisma.challenges.findUnique({ where: { unique_id: challengeUniqueId } })
    if (!challenge) return

    const session = await prisma.challenge_sessions.findFirst({
      where: { challenge_id: challenge.id, user_id: userId },
    })
    if (!session || session.status === 'completed') return

    const questionIds = session.question_ids
    if (!questionIds.includes(questionId)) return

    // "Seen" call — create record if not exists, never overwrite
    if (timeTakenSeconds === null || timeTakenSeconds === undefined) {
      await prisma.challenge_session_answers.upsert({
        where: { session_id_question_id: { session_id: session.id, question_id: questionId } },
        update: {},
        create: { session_id: session.id, question_id: questionId, selected_option_index: null, is_correct: false, time_taken_seconds: null },
      })
      return null
    }

    // Actual answer or timed-out (selectedOptionIndex === null)
    let isCorrect = false
    let isSpecial = false
    if (selectedOptionIndex !== null && selectedOptionIndex !== undefined) {
      const question = await prisma.challenge_questions.findUnique({
        where: { id: questionId },
        select: { correct_option_index: true, is_special: true },
      })
      if (!question) return
      isCorrect = selectedOptionIndex === question.correct_option_index
      isSpecial = question.is_special
    }

    const { base_points_per_correct: base, seconds_per_question: secondsPerQ, scoring_type } = challenge
    const isClassic = scoring_type === 'classic'

    const newStreak = isCorrect && isClassic ? session.current_streak + 1 : 0

    let pointsEarned = 0
    if (isCorrect) {
      if (isClassic) {
        const timeTaken = Math.min(timeTakenSeconds, secondsPerQ)
        const speedFactor = 0.5 + 0.5 * ((secondsPerQ - timeTaken) / secondsPerQ)
        const streakMult = newStreak >= 5 ? 2 : newStreak >= 3 ? 1.5 : 1
        pointsEarned = Math.round(base * (isSpecial ? 2 : 1) * speedFactor * streakMult)
      } else {
        pointsEarned = isSpecial ? 2 : 1
      }
    }

    const newScore = (session.score ?? 0) + pointsEarned

    await prisma.$transaction([
      prisma.challenge_session_answers.upsert({
        where: { session_id_question_id: { session_id: session.id, question_id: questionId } },
        update: { selected_option_index: selectedOptionIndex, is_correct: isCorrect, time_taken_seconds: timeTakenSeconds },
        create: { session_id: session.id, question_id: questionId, selected_option_index: selectedOptionIndex, is_correct: isCorrect, time_taken_seconds: timeTakenSeconds },
      }),
      prisma.challenge_sessions.update({
        where: { id: session.id },
        data: { current_streak: newStreak, score: newScore },
      }),
    ])

    return { isCorrect, streak: isClassic ? newStreak : null, totalScore: newScore, pointsEarned }
  }
}
