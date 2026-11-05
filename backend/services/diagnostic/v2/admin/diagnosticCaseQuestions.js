import { ValidationError } from '#errors/validationError'

// A case screen shows every question under it at once, so a case with no questions
// would render an empty question panel — reject it at the edge instead.
export function normalizeCaseQuestions(questions) {
  if (!Array.isArray(questions) || questions.length === 0) {
    throw new ValidationError('Kasus harus memiliki minimal 1 soal')
  }

  return questions.map((q, i) => {
    const label = `Soal ${i + 1}`
    const answerType = q.answerType === 'text' ? 'text' : 'multiple_choice'

    if (!q.question?.trim()) throw new ValidationError(`${label}: pertanyaan wajib diisi`)
    if (!q.answer?.trim()) throw new ValidationError(`${label}: jawaban wajib diisi`)

    const choices = Array.isArray(q.choices) ? q.choices.map(c => String(c).trim()).filter(Boolean) : []
    if (answerType === 'multiple_choice') {
      if (choices.length < 2) throw new ValidationError(`${label}: pilihan jawaban minimal 2 opsi`)
      if (!choices.includes(q.answer.trim())) throw new ValidationError(`${label}: jawaban benar harus salah satu dari pilihan`)
    }

    return {
      question: q.question.trim(),
      answer: q.answer.trim(),
      answer_type: answerType,
      choices: answerType === 'multiple_choice' ? choices : null,
      explanation_short: q.explanationShort?.trim() || null,
      explanation_long: q.explanationLong?.trim() || null,
      references: Array.isArray(q.references) ? q.references : [],
      order: i,
    }
  })
}
