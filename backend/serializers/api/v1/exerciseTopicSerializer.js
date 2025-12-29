export class ExerciseTopicSerializer {
  static serialize(topic) {
    return {
      id: topic.id,
      title: topic.title,
      description: topic.description,
      questions: (topic.questions || []).map((q, index) => ({
        id: q.id,
        question: q.question,
        order: q.order !== undefined ? q.order : index
      }))
    }
  }
}
