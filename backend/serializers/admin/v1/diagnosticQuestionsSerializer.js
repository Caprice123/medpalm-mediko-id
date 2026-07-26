import { toJakartaISO } from '#utils/dateUtils'

export class DiagnosticQuestionsSerializer {
  static serialize(question) {
    return {
      id: question.id,
      question: question.question,
      vignette: question.vignette ?? null,
      answer: question.answer,
      answerType: question.answer_type,
      choices: question.choices,
      explanation: question.explanation ?? null,
      imageCaption: question.image_caption ?? null,
      imageUrl: question.imageUrl ?? null,
      imageBlobId: question.imageBlobId ?? null,
      createdAt: toJakartaISO(question.created_at),
      updatedAt: toJakartaISO(question.updated_at),
    }
  }

  static serializeList(questions) {
    return questions.map(this.serialize.bind(this))
  }
}
