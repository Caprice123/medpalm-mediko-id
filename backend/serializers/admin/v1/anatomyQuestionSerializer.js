export class AnatomyQuestionSerializer {
  static serialize(questions) {
    if (!Array.isArray(questions)) {
      return []
    }

    return questions.map((question, index) => ({
      id: question.id || Date.now() + index,
      question: question.question,
      answer: question.answer,
      explanation: question.explanation || '',
      order: question.order !== undefined ? question.order : index
    }))
  }
}
