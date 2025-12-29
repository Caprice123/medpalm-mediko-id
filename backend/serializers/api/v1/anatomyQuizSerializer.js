export class AnatomyQuizSerializer {
  static serialize(quiz) {
    const questions = quiz.anatomy_questions || []

    return {
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      imageUrl: quiz.image_url,
      anatomy_questions: questions.map(question => ({
        id: question.id,
        question: question.question
        // IMPORTANT: Do NOT include 'answer' field - that would leak correct answers to client!
      }))
    }
  }
}
