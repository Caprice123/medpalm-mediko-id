export class McqTopicSessionSerializer {
  static serialize(data) {
    const { topic, mode } = data
    const questions = topic.mcq_questions || []

    return {
      topic: {
        id: topic.id,
        title: topic.title,
        description: topic.description,
        quiz_time_limit: topic.quiz_time_limit,
        passing_score: topic.passing_score
      },
      mode,
      questions: questions.map((q, index) => {
        const question = {
          id: q.id,
          question: q.question,
          image_url: q.image_url || null,
          options: q.options,
          order: q.order !== undefined ? q.order : index
        }

        // SECURITY: In quiz mode, do NOT include correct_answer or explanation
        // In learning mode, include explanation but still hide correct_answer initially
        // (correct_answer should only be revealed after user submits their answer)
        if (mode === 'learning') {
          question.explanation = q.explanation
        }

        // Include user progress if available
        if (q.userProgress) {
          question.userProgress = q.userProgress
        }

        return question
      })
    }
  }
}
