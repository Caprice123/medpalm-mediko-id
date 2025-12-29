export class McqTopicSerializer {
  static serialize(topic, includeAnswers = false) {
    const questions = topic.mcq_questions || topic.questions || []

    return {
      id: topic.id,
      title: topic.title,
      description: topic.description,
      quiz_time_limit: topic.quiz_time_limit,
      mcq_questions: questions.map(q => {
        const question = {
          id: q.id,
          question: q.question,
          options: q.options
        }

        // SECURITY: Only include answers when explicitly requested (after submission or in learning mode after answer)
        if (includeAnswers) {
          question.correct_answer = q.correct_answer
          question.explanation = q.explanation
        }

        return question
      })
    }
  }
}
