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

    const question = await prisma.challenge_questions.findUnique({
      where: { id: questionId },
      select: { correct_option_index: true },
    })
    if (!question) return

    const isCorrect = selectedOptionIndex === question.correct_option_index

    await prisma.challenge_session_answers.upsert({
      where: { session_id_question_id: { session_id: session.id, question_id: questionId } },
      update: { selected_option_index: selectedOptionIndex, is_correct: isCorrect, time_taken_seconds: timeTakenSeconds },
      create: { session_id: session.id, question_id: questionId, selected_option_index: selectedOptionIndex, is_correct: isCorrect, time_taken_seconds: timeTakenSeconds },
    })
  }
}
