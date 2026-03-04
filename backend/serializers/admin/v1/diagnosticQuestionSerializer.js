export class DiagnosticQuestionSerializer {
  static serialize(questions) {
    if (!Array.isArray(questions)) {
      return []
    }

    return questions.map((question, index) => ({
      id: question.id || Date.now() + index,
      question: question.question,
      answer: question.answer,
      answerType: question.answer_type || question.answerType || 'text',
      choices: question.choices || null,
      explanation: question.explanation || '',
      order: question.order !== undefined ? question.order : index
    }))
  }
}
