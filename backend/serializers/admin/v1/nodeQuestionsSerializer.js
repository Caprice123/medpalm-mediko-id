import { toJakartaISO } from '#utils/dateUtils'

export class NodeQuestionsSerializer {
  static serialize(question) {
    return {
      id: question.id,
      nodeId: question.nodeId ?? null,
      question: question.question,
      options: question.options,
      correctIndex: question.correct_answer,
      explanation: question.explanation ?? null,
      version: question.version ?? 1,
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
